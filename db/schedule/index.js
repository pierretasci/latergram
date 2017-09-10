const mongoose = require('mongoose');
const constants = require('../../constants');

const REPETITION_TYPES = [
  constants.REPETITION_TYPES.REPEAT_NONE,
  constants.REPETITION_TYPES.REPEAT_WEEKLY,
  constants.REPETITION_TYPES.REPEAT_WEEKDAYS,
  constants.REPETITION_TYPES.REPEAT_EVERYDAY,
  constants.REPETITION_TYPES.REPEAT_WEEKENDS,
];

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'users',
  },
  start: { type: Date, required: true },
  start_timezone: { type: String, required: true },
  repetition: { type: Boolean, required: true, default: false },
  repetition_type: { type: String, enum: REPETITION_TYPES },
  repetition_hour: { type: Number, min: 1, max: 12 },
  repetition_minute: { type: Number, min: 0, max: 60 },
  repetition_meridian: { type: String, enum: ['AM', 'PM'] },
  nearing_completion: { type: Date },
}, {
  timestamps: true,
});

module.exports = mongoose.model('schedules', ScheduleSchema);
