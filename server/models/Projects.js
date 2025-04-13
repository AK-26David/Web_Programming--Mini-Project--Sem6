// server/models/Project.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Project title cannot exceed 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  fundingGoal: {
    type: Number,
    required: [true, 'Funding goal is required']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: [
      'Technology', 
      'Art', 
      'Science', 
      'Social', 
      'Environmental', 
      'Educational',
      'Other'
    ]
  },
  images: [String],
  coverImage: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supporters: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  endDate: {
    type: Date,
    required: [true, 'Project end date is required']
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  updates: [{
    title: String,
    content: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  achievementUnlocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create slug from title
ProjectSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);