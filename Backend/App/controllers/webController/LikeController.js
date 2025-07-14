const BlogsModel = require('../../models/adminModel/admin_BlogsModel');
const WebUserBlog = require('../../models/webModel/WriteBlogModel');
const likeBlog = async (req, res) => {
  try {
    const { usertype } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id;
    const finalModel = usertype === "user" ? WebUserBlog : BlogsModel;

    const blog = await finalModel.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadyLiked = blog.likes.includes(userId);
    const alreadyDisliked = blog.dislikes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId);
    } else {
      blog.likes.push(userId);
      if (alreadyDisliked) {
        blog.dislikes = blog.dislikes.filter(id => id.toString() !== userId);
      }
    }

    // ✅ Save blog first
    await blog.save();

    // ✅ Now repopulate the blog with createdBy data
    const populatedBlog = await finalModel
      .findById(blogId)
      .populate("createdBy", "username name"); // Yeh line important hai!

    // ✅ Send populated blog in response
    return res.status(200).json({
      message: alreadyLiked ? "Blog unliked" : "Blog liked",
      updatedBlog: populatedBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const dislikes = async (req, res) => {
  try {
    const { usertype } = req.body;
    const blogId = req.params.id;
    const userId = req.user.id;
    const finalModel = usertype === "user" ? WebUserBlog : BlogsModel;

    const blog = await finalModel.findById(blogId);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const alreadyDisliked = blog.dislikes.includes(userId);
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyDisliked) {
      blog.dislikes = blog.dislikes.filter(id => id.toString() !== userId);
    } else {
      blog.dislikes.push(userId);
      if (alreadyLiked) {
        blog.likes = blog.likes.filter(id => id.toString() !== userId);
      }
    }

    await blog.save();

    // ✅ Repopulate createdBy
    const populatedBlog = await finalModel
      .findById(blogId)
      .populate("createdBy", "username name");

    return res.status(200).json({
      message: alreadyDisliked ? "Dislike removed" : "Blog disliked",
      updatedBlog: populatedBlog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};





module.exports = { likeBlog, dislikes }