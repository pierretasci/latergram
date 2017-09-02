const session = require('express-session');
const mongoSession = require('connect-mongodb-session');

const MongoStore = mongoSession(session);

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year.
    sameSite: true,
    secure: false,
  },
  store: new MongoStore({
    uri: process.env.SESSION_URI,
    collection: 'sessions',
  }),
  resave: false,
  saveUninitialized: false,
};

if (process.env.NODE_ENV === 'production') {
  sessionOptions.cookie.secure = true;
}

module.exports = session(sessionOptions);
