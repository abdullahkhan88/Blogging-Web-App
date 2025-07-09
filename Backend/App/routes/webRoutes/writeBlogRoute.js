let express = require('express');
const AuthMiddleware = require('../../middleware/web_middleware/Authentication');
const uploads = require('../../middleware/web_middleware/UserBlogUpload');
let writeBlogRoutes = express.Router();

const {
    createUserBlog,
    fetchAllWebBlogs,
    fetchAllPendingWebBlogs,
    deleteBlog,
    approveBlog,
    rejectBlog,
    getPendingBlogCount,
    getUserApprovedBlogs,
    getLoginUserBlogs
} = require('../../controllers/webController/WebUserBlogsContrller');

writeBlogRoutes.post('/writeBlog', AuthMiddleware,uploads.single('photo'),createUserBlog);// http://localhost:8000/web/api/writeBlog;
writeBlogRoutes.get('/getPendingBlogs',fetchAllPendingWebBlogs); // http://localhost:8000/web/api/getPendingBlogs;
writeBlogRoutes.get('/getBlogs',AuthMiddleware,fetchAllWebBlogs); // http://localhost:8000/web/api/getBlogs;
writeBlogRoutes.get('/getPendingBlogCount',getPendingBlogCount); // http://localhost:8000/web/api/getPendingBlogCount;
writeBlogRoutes.patch('/approveBlog/:id',approveBlog); // http://localhost:8000/web/api/approveBlogs;
writeBlogRoutes.put('/rejectedBlogs/:id',rejectBlog); // http://localhost:8000/web/api/rejectedBlogs;
writeBlogRoutes.delete('/deleteBlog/:id',AuthMiddleware,deleteBlog); // http://localhost:8000/web/api/deleteBlog;
writeBlogRoutes.get('/getUserApprovedBlog',getUserApprovedBlogs); // http://localhost:8000/web/api/getUserApprovedBlog;
writeBlogRoutes.get('/getLoginUserBlog',AuthMiddleware,getLoginUserBlogs); // http://localhost:8000/web/api/getLoginUserBlog;

module.exports = writeBlogRoutes;