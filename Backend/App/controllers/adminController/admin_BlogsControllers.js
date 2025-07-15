const BlogsModel = require('../../models/adminModel/admin_BlogsModel');

const createBlogs = async (req, res) => {
  try {
    
    let { category, title, description } = req.body;
    let photopath = req.file?.secure_url || ''
    if (!req.file) {
      return res.status(400).send({ status: 0, message: "Photo is required" });
    };
    let BlogsData = new BlogsModel({
      category,
      title,
      description,
      createdBy: req.user.id,
      photo: photopath
    });
    await BlogsData.save();
    res.status(200).send({
      status: 1,
      message: "Data Save Successfully"
    });
  } catch (err) {
    
    res.status(500).send({ status: 0, message: "Internal Server Error", error:err })
  }
};

// fetch All Data

const showBlogList = async (req, res) => {
  try {
    let Category = await BlogsModel.find().populate("createdBy", "name");
    res.status(200).send({ status: 1, message: "Get Data Successfully", data: Category });
    
  } catch (error) {
    res.status(404).send({ status: 0, message: "Unable to Fetch Data", error: error.message });
  }
};

// Delete Blogs code

const deleteBlogs = async (req, res) => {
  try {
    let id = req.params.id;
    let deleteRes = await BlogsModel.deleteOne({ _id: id });
    console.log(deleteRes);
    if (deleteRes.deletedCount === 0) {
      return res.status(404).send({ status: 0, message: "Blogs Not Found" });
    }
    res.status(200).send({ status: 1, message: "Blogs Deleted Successfully" })
  } catch (error) {
    res.status(500).send({ status: 0, message: "Unable to Deleted Blogs", error })
  }

};

// get single Data for update

const getSingleBlogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await BlogsModel.findById(userId);

    if (!result) {
      return res.status(404).send({
        status: 0,
        message: "Blogs Not Found",
        result: null,
      });
    };

    res.status(200).send({
      status: 1,
      message: "Blogs Found Successfully",
      result
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      message: "Internal Server Error",
      error: error.message,
    });
  };
};

// update Blogs code

const updateBlogs = async (req, res) => {
  try {
    let id = req.params.id;
    let { category, title, description } = req.body;
    const obj = {};

    if (category) obj.category = category; // agar category aa raga to obj mein categry dal do
    if (title) obj.title = title;// same here upper line
    if (description) obj.description = description;

    // Check for uploaded file
    if (req.file) {
      obj.photo = req.file.filename; // Save filename only (you can also store full path)
    }
    let UpdateRes = await BlogsModel.updateOne({ _id: id }, obj);
    res.status(200).send({ status: 1, message: "Blogs Updated Successfully", data: UpdateRes })
  } catch (error) {
    res.status(500).send({ status: 0, message: "Some Internal Error" });
  };
};

// Count Blogs

const getBlogCount = async (req, res) => {
    try {
        const totalBlogs = await BlogsModel.countDocuments();
        res.status(200).json({ success: true, count: totalBlogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting user count" });
    }
};



module.exports = {
  createBlogs,
  showBlogList,
  deleteBlogs,
  getSingleBlogs,
  updateBlogs,
  getBlogCount
};

