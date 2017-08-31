const mongoose = require('mongoose');
// Loads all of the individual collections.
require('./item');
require('./user');

mongoose.Promise = global.Promise;

// Now connect to Mongo.
mongoose.connect(process.env.DB_URI, {
  useMongoClient: true,
});

