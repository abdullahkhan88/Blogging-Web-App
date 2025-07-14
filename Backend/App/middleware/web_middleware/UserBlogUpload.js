const multer = require('multer');
const path = require('path');

// Storage engine setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/UserBlog'); // ✅ Uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); // ✅ e.g., 1718912345678.jpg
    cb(null, uniqueName);
  }
});

// Multer middleware
const upload = multer({ storage });

module.exports = upload;
