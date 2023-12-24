const mongoose = require('mongoose');

/**
 * Activity Schema
 * @private
 */
const activitySchema = new mongoose.Schema({
  playerId: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  lastActivity: {
    type: Date,
    trim: true,
  },
  dailyPlaytime: {
    type: Number,
  },
}, {
  timestamps: true,
});

/**
 * @typedef Activity
 */
module.exports = mongoose.model('Activity', activitySchema);
