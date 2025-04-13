const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  goal: {
    type: Number,
    required: true,
    min: 0
  },
  amountRaised: {
    type: Number,
    default: 0
  },
  image: {
    type: String, // URL of project image
    default: ''
  },
  category: {
    type: String,
    enum: ['Tech', 'Art', 'Education', 'Health', 'Community', 'Other'],
    default: 'Other'
  },
  creator: {
    type: String, // could be user ID or name/email
    required: true
  },
  backers: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
