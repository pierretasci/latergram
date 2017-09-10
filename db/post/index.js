const mongoose = require('mongoose');
const moment = require('moment-timezone');
const constants = require('../../constants');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  schedule: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'schedules',
    index: true,
  },
  post_time_utc: { type: Date, required: true },
  has_media: { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

/**
 * Given a Schedule, creates a Post for each of the first 50 instances of that
 * schedule. Returns the saved posts.
 */
PostSchema.statics.createFirst50 = function (schedule) { // eslint-disable-line func-names
  // Store the start date and time in local time.
  const start = moment(schedule.start)
    .tz(schedule.start_timezone)
    .hours(schedule.repetition_hour +
      (schedule.repetition_meridian === 'PM' ? 12 : 0))
    .minutes(schedule.repetition_minute);

  if (!schedule.repetition) {
    return this.create({
      schedule: schedule._id,
      post_time_utc: moment(start).toDate(),
    });
  }

  const posts = [];
  switch (schedule.repetition_type) {
    case constants.REPETITION_TYPES.REPEAT_EVERYDAY: {
      const postDate = moment(start);
      for (let i = 0; i < 50; i += 1) {
        const p = {
          insertOne: {
            document: {
              schedule: schedule._id,
              post_time_utc: moment(postDate).toDate(),
            },
          },
        };
        posts.push(p);
        postDate.add(1, 'days');
      }
      break;
    }
    case constants.REPETITION_TYPES.REPEAT_WEEKDAYS: {
      const postDate = moment(start);
      // Move to the first weekday on or after postDate. M = 1, F = 5.
      while (postDate.day() > 5 || postDate.day() < 1) {
        postDate.add(1, 'days');
      }
      for (let i = 0; i < 50; i += 1) {
        const p = {
          insertOne: {
            document: {
              schedule: schedule._id,
              post_time_utc: moment(postDate).toDate(),
            },
          },
        };
        posts.push(p);

        if (postDate.day() === 5) {
          postDate.add(3, 'days');
        } else {
          postDate.add(1, 'days');
        }
      }
      break;
    }
    case constants.REPETITION_TYPES.REPEAT_WEEKENDS: {
      const postDate = moment(start);
      // Move to the first weekend on or after postDate. S = 0, S = 6.
      while (postDate.day() !== 0 || postDate.day() !== 6) {
        postDate.add(1, 'days');
      }
      for (let i = 0; i < 50; i += 1) {
        const p = {
          insertOne: {
            document: {
              schedule: schedule._id,
              post_time_utc: moment(postDate).toDate(),
            },
          },
        };
        posts.push(p);

        if (postDate.day() === 0) {
          postDate.add(6, 'days');
        } else {
          postDate.add(1, 'days');
        }
      }
      break;
    }
    case constants.REPETITION_TYPES.REPEAT_WEEKLY: {
      const postDate = moment(start);
      for (let i = 0; i < 50; i += 1) {
        const p = {
          insertOne: {
            document: {
              schedule: schedule._id,
              post_time_utc: moment(postDate).toDate(),
            },
          },
        };
        posts.push(p);
        postDate.add(1, 'weeks');
      }
      break;
    }
    default:
      return Promise.reject(`Unsupported repetition type: ${schedule.repetition_type}`);
  }

  return this.bulkWrite(posts);
};

module.exports = mongoose.model('posts', PostSchema);
