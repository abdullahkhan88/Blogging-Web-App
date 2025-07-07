const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/users/');
  },
  filename: (req, file, cb) => {
    cb(null, 'user-' + Date.now() + path.extname(file.originalname));
  }
});
const userStorage = multer({ storage });
module.exports = userStorage;