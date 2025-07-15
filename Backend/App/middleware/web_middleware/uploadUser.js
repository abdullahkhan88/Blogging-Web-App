const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../CloudinaryConfig/cloudinary'); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const userStorage = multer({ storage });
module.exports = userStorage;