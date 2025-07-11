const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blogs',
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false   // 👈 Default false so admin can approve
  }
}, { timestamps: true });

let commentModel= mongoose.model('comments', commentSchema);
module.exports = commentModel;