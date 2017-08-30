const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  description: { type: String, required: true },
  media: { type: String, required: true },
  scheduled: { type: Date, required: true, index: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('items', ItemSchema);
