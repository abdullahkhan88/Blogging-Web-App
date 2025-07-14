const commentModel = require('../../models/webModel/commentModel');

// ye Comment ko approve karega jismein ye approved ki value ko True karega

const approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await commentModel.findByIdAndUpdate(
      commentId,
      { isApproved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ success: true, message: "Comment approved", comment });
  } catch (err) {
    console.error("Approve Comment Error:", err.message);
    res.status(500).json({ message: "Approval failed" });
  }
};

// Ye fetch Kar Raha hai Pending Comment ko 

const getPendingComments = async (req, res) => {
  try {
    const comments = await commentModel.find({ isApproved: false })
      .populate('userId', 'username')
      .populate('blogId', 'title');

    const formatted = comments.map(comment => ({
      _id: comment._id,
      text: comment.text,
      userName: comment.userId?.username || 'Unknown',
      blogTitle: comment.blogId?.title || 'Unknown Blog',
      createdAt: comment.createdAt,
    }));

    res.status(200).json({ success: true, comments: formatted });
  } catch (err) {
    console.error("Pending Comments Error:", err.message);
    res.status(500).json({ message: "Pending comments fetch nahi ho paye" });
  }
};


module.exports = {approveComment,getPendingComments};
