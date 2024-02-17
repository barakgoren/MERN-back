const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Assuming you have a User model defined elsewhere
  },
  content: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends of a string
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically sets to current date and time
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to handle the "updatedAt" field update
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
