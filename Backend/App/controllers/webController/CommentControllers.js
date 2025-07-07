const commentModel = require('../../models/webModel/commentModel');


const commentCreate = async (req, res) => {
  try {
    const { blogId, text } = req.body;
    const userId = req.user?.id;

    if (!blogId || !userId || !text) {
      return res.status(400).json({ message: "All fields required" });
    }

    const comment = await commentModel.create({
      blogId,
      userId, 
      text,
      isApproved:false,
    });
   const populatedComment = await comment.populate('userId', 'username');
    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    console.error("Comment Create Error:", err.message);
    res.status(500).json({ message: "Comment add nahi ho paya " });
  }
};

// is controller se approved comment show kara raha hu

const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id; // JWT middleware se aata hai

    const filter = {
      blogId,
      $or: [
        { isApproved: true },           // Sabke liye visible
        ...(userId ? [{ userId }] : []) // Apna unapproved comment
      ]
    };

    const comments = await commentModel.find(filter)
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments });

  } catch (err) {
    console.error("Fetch Comments Error:", err.message);
    res.status(500).json({ message: "Comments fetch nahi ho paye" });
  }
};


const deleteComments = async (req, res) => {
  try {
    const comment = await commentModel.findById(req.params.id);
    if (!comment) return res.status(404).send({ message: 'Comment not found' });
    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    await commentModel.findByIdAndDelete(req.params.id);
    res.send({ message: 'Deleted' });

  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).send({ message: err.message });
  }
};


module.exports = {
    commentCreate,
    getCommentsByBlog,
    deleteComments
};