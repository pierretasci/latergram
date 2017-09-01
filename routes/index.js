const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const params = {
    title: 'Augustus',
  };

  if (req.user) {
    params.logged_in_username = req.user.username;
    params.logged_in_fullname = req.user.name;
  }

  res.render('index', params);
});

module.exports = router;
