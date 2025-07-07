const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin_user", // 👈 yahi hona chahiye  
  },
  photo: {
    type: String,
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

const BlogsModel = mongoose.model('Blogs', blogSchema);

module.exports = BlogsModel;
