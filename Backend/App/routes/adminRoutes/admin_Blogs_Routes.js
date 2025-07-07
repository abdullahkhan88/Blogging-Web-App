const express = require('express');
const adminBlogs = express.Router();
const AdminAuthMiddleware = require('../../middleware/admin_middleware/AdminAuthentication');
const {
    createBlogs,
    showBlogList,
    deleteBlogs,
    getSingleBlogs,
    updateBlogs,
    getBlogCount
} = require("../../controllers/adminController/admin_BlogsControllers");

const upload = require('../../middleware/admin_middleware/upload'); // middleware


// Route to upload blog with file
adminBlogs.post('/createBlogs',AdminAuthMiddleware,upload.single('photo'),createBlogs); // http://localhost:8000/admin/api/createblogs
adminBlogs.get('/showblogs',showBlogList); // http://localhost:8000/admin/api/showblogs;
adminBlogs.get('/blogscount',AdminAuthMiddleware,getBlogCount); // http://localhost:8000/admin/api/blogscount;
adminBlogs.delete('/deleteblogs/:id',deleteBlogs) // http://localhost:8000/admin/api/deleteblogs;
adminBlogs.get('/getsingleblogs/:id',getSingleBlogs) // http://localhost:8000/admin/api/getsingleblogs;
adminBlogs.put('/updateblogs/:id',updateBlogs) // http://localhost:8000/admin/api/updateblogs;


module.exports = adminBlogs;

