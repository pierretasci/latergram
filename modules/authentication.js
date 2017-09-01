const passport = require('passport');
const InstagramStategy = require('passport-instagram');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  User.findOne({ username })
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

passport.use(new InstagramStategy({
  clientID: process.env.INSTAGRAM_CLIENT_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: `${process.env.DOMAIN}/auth/instagram/callback`,
}, (accessToken, refreshToken, raw, done) => {
  const profile = raw._json.data;
  User.findOneAndUpdate({
    username: profile.username,
  }, {
    username: profile.username,
    name: profile.full_name,
    profile_picture: profile.profile_picture,
  }, {
    new: true,
    upsert: true,
  }).then(user => done(null, user))
    .catch(err => done(err, null));
}));
