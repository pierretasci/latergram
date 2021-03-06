const express = require('express');
// Loads the environment variables specifc to this instance.
require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const csurf = require('csurf');
const session = require('./modules/sessions');

// Load the database.
require('./db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
require('./modules/authentication');

app.use(csurf({ cookie: false }));
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index');
const auth = require('./routes/authentication');
const post = require('./routes/post');
const schedule = require('./routes/schedule');

app.use('/', index);
app.use('/auth', auth);
app.use('/post', post);
app.use('/schedule', schedule);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
