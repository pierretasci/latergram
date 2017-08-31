const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, index: true, unique: true },
  profile_picture: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('users', UserSchema);
