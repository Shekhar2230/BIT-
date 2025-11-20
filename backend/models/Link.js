const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/
  },
  target: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastClicked: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Link', linkSchema);