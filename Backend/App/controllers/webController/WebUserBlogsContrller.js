const WebUserModel = require('../../models/webModel/WriteBlogModel'); // aapke user blog model ka path

const createUserBlog = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    // Check required fields
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Photo path if uploaded
    const photoPath = req.file?.path|| '';

    const newBlog = new WebUserModel({
      title,
      category,
      description,
      photo: photoPath,
      createdBy: req.user.id,     // assuming userMiddleware adds this
      createdByRole: 'User',   // optional, already default in schema
      isApproved: false       
    });

    await newBlog.save();

    res.status(201).send({
      success: true,
      message: 'User blog created successfully',
      blog: newBlog
    });

  } catch (error) {
    console.error('Error creating user blog:', error.message);
    res.status(500).send({
      success: false,
      message: 'Something went wrong while creating the blog.'
    });
  }
};

// GET all blogs which is approved
const fetchAllPendingWebBlogs = async (req, res) => {
  try {
    const blogs = await WebUserModel.find({ isApproved:false, isRejected:false }).populate("createdBy","username").sort({ createdAt: -1 }); // ✅ filter added
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// get all blogs for show ui pe

const fetchAllWebBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await WebUserModel.find({
      createdBy:userId
    }).sort({ createdAt: -1 }); // latest first
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


// Delete Blogs Controller
const deleteBlog = async (req, res) => {
  try {
    const blog = await WebUserModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne(); // or Blog.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Approval Blogs Controller

const approveBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await WebUserModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Don't approve if blog is already rejected
    if (blog.isRejected) {
      return res.status(400).json({ success: false, message: "Rejected blog cannot be approved" });
    }

    blog.isApproved = true;
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog approved successfully",
      blog,
    });
  } catch (error) {
    console.error("Approval error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during approval",
    });
  }
};


// Rejected Blogs

const rejectBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const blog = await WebUserModel.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // If already approved or rejected
    if (blog.isApproved || blog.isRejected) {
      return res.status(400).json({
        success: false,
        message: "Only pending blogs can be rejected"
      });
    }

    //  Mark as rejected
    blog.isRejected = true;
    blog.rejectionReason = rejectionReason || "Rejected by admin";
    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog rejected successfully",
      blog
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

// GET /admin/api/pendingblogcount

const getPendingBlogCount = async (req, res) => {
  try {
    const count = await WebUserModel.countDocuments({ isApproved: false });
    
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending blog count" });
  }
};

// MyBlog mein Blog ko dekhane ke liye

// Middleware ke through req.user.id mila hoga (JWT verify ke baad)
const getUserApprovedBlogs = async (req, res) => {
  try {
    //const userId = req.user.id; // Ensure JWT middleware laga ho
    const blogs = await WebUserModel.find({
      // createdBy: userId,
      isApproved: true,
      isRejected : false,
    }).populate("createdBy", "username");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Jo user Login hai usi ka blog show karna 

const getLoginUserBlogs = async (req, res) => {
  try {
    const userId = req.user.id;  // JWT middleware se milta hai user id
    const blogs = await WebUserModel.find({
      createdBy: userId,         // Sirf login user ke blogs
      isApproved: true,          // Approve hone chahiye
      isRejected: false          // Reject nahi hone chahiye
    }).populate("createdBy", "username"); // User ka naam bhi bhejna

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching login user's blogs:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};



module.exports = {
  createUserBlog,
  fetchAllPendingWebBlogs,
  fetchAllWebBlogs,
  deleteBlog,
  approveBlog,
  rejectBlog,
  getPendingBlogCount,
  getUserApprovedBlogs,
  getLoginUserBlogs
};
