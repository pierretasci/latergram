const express = require('express');
const authenticated = require('../middleware/authentication');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const constants = require('../constants');
const moment = require('moment-timezone');

const Schedule = mongoose.model('schedules');
const Post = mongoose.model('posts');
const router = express.Router();

/* GET scheduling page. */
router.get('/', authenticated, (req, res, next) => {
  const params = {
    title: 'Augustus',
    page_data: {
      csrfToken: req.csrfToken(),
    },
    logged_in_username: req.user.username,
    logged_in_fullname: req.user.name,
  };

  if (req.session.schedule_errors &&
      Object.keys(req.session.schedule_errors).length > 0) {
    params.page_data.errors = req.session.schedule_errors.errors;
    params.page_data.prefill = req.session.schedule_errors.prefill;
    delete req.session.schedule_errors;
  }

  Schedule.find({ user: req.user._id },
    'start repetition repetition_type repetition_hour repetition_minute' +
    'repetition_meridianm').then((schedules) => {
    params.page_data.schedules = schedules.map(s => s.toObject());

    console.log(schedules.map(s => s._id));

    return Post.find({ schedule: { $in: schedules.map(s => s._id) } },
      'schedule post_time_utc has_media')
      .then((posts) => {
        params.page_data.posts = posts.map(p => p.toObject());
        res.render('schedule', params);
      });
  }).catch(err => next(err));
});

router.post('/', [
  authenticated,
  check('repetition-type').isIn([
    constants.REPETITION_TYPES.REPEAT_NONE,
    constants.REPETITION_TYPES.REPEAT_EVERYDAY,
    constants.REPETITION_TYPES.REPEAT_WEEKDAYS,
    constants.REPETITION_TYPES.REPEAT_WEEKENDS,
    constants.REPETITION_TYPES.REPEAT_WEEKLY,
  ]).withMessage('Incorrect repetition type.'),
  check('date').isISO8601().withMessage('Can\'t parse date.'),
  check('hours').isNumeric().custom(value =>
    Number(value) > 0 && Number(value) <= 12)
    .withMessage('Hours must be a number 1-12'),
  check('minutes').isNumeric().custom(value =>
    Number(value) >= 0 && Number(value) <= 59)
    .withMessage('Minutes must be a number 0-59'),
  check('meridian').isIn(['AM', 'PM']),
  check('timezone').exists(),
],
(req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.session.schedule_errors = {};
    req.session.schedule_errors.errors = errors.mapped();
    req.session.schedule_errors.prefill = matchedData(req);
    return res.status(422).redirect('/schedule');
  }

  const rawScheduleData = matchedData(req);
  // First create the Schedule.
  return Schedule.create({
    user: req.user._id,
    start: moment.tz(rawScheduleData.date, rawScheduleData.timezone).toDate(),
    start_timezone: rawScheduleData.timezone,
    repetition: rawScheduleData['repetition-type'] !== constants.REPETITION_TYPES.REPEAT_NONE,
    repetition_type: rawScheduleData['repetition-type'],
    repetition_hour: rawScheduleData.hours,
    repetition_minute: rawScheduleData.minutes,
    repetition_meridian: rawScheduleData.meridian,
  }).then((schedule) => {
    if (schedule.repetition === false) {
      return res.redirect('/schedule');
    }

    return Post.createFirst50(schedule)
      .then(() => res.redirect('/schedule'))
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });
});

module.exports = router;
