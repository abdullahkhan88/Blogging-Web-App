let express = require('express');
let userCommentRoutes = express.Router();
let AuthMiddleware = require('../../middleware/web_middleware/Authentication');
 
let {
    commentCreate,
    getCommentsByBlog,
    deleteComments
} = require('../../controllers/webController/CommentControllers');

userCommentRoutes.post('/comment',AuthMiddleware,commentCreate);// http://localhost:8000/web/api/comment;
userCommentRoutes.get('/fetchComment/:blogId',AuthMiddleware,getCommentsByBlog);// http://localhost:8000/web/api/fetchComment;
userCommentRoutes.delete('/deleteComment/:id',AuthMiddleware,deleteComments);// http://localhost:8000/web/api/deleteComment;

module.exports = userCommentRoutes;
