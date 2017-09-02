module.exports = (req, res, next) => {
  if (!req.user) {
    console.log('No user, redirecting to login.');
    return res.redirect('/');
  }
  return next();
};
