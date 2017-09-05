const express = require('express');
const authenticated = require('../middleware/authentication');
const upload = require('../middleware/multer');

const router = express.Router();

/* GET home page. */
router.get('/', authenticated, (req, res) => {
  const params = {
    title: 'Augustus',
  };

  if (req.user) {
    params.logged_in_username = req.user.username;
    params.logged_in_fullname = req.user.name;
  }

  res.render('schedule', params);
});

router.post('/', authenticated, upload.single('media_content'), (req, res) => {
  res.send('Success');
});

module.exports = router;
