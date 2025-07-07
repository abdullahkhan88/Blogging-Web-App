const mongoose = require('mongoose');

const WebUserBlogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' // user reference only
  },
  createdByRole: {
    type: String,
    enum: ['User'],
    default: 'User' // locked to 'User' blogs only
  },
  isApproved: {
    type: Boolean,
    default: false // by default, blog is not approved
  },

  // New fields for rejection
  isRejected: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      
    }
  ]
});

const WebUserModel = mongoose.model("WebUserBlog", WebUserBlogSchema);
module.exports = WebUserModel;
