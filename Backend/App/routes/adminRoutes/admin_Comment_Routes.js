const express = require('express');
const adminCommentRoutes = express.Router();

const AuthMiddleware = require('../../middleware/web_middleware/Authentication');
let {
    approveComment,
    getPendingComments
} = require('../../controllers/adminController/admin_commentApproval');

adminCommentRoutes.patch('/approveComment/:commentId',approveComment); //http://localhost:8000/admin/api/approveComment;
adminCommentRoutes.get('/pendingComments/',getPendingComments); //http://localhost:8000/admin/api/pendingComments;

module.exports = adminCommentRoutes;