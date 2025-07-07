const express = require('express');
const adminRouter = express.Router();
const AdminAuthMiddleware = require('../../middleware/admin_middleware/AdminAuthentication');
let { 
    adminInsert,
    adminLogin,
    adminList,
    adminDelete,
    getSingleList,
    updateAdminList,
    getUserCount
} = require('../../controllers/adminController/admin_userController');

adminRouter.post('/adminInsert',adminInsert);// http://localhost:8000/admin/api/adminInsert
adminRouter.post('/adminlogin',adminLogin); //http://localhost:8000/admin/api/adminlogin
adminRouter.get('/adminList',adminList); //http://localhost:8000/admin/api/adminList
adminRouter.get('/usercount',AdminAuthMiddleware,getUserCount); //http://localhost:8000/admin/api/usercount
adminRouter.delete('/adminDelete/:id',AdminAuthMiddleware,adminDelete); //http://localhost:8000/admin/api/adminDelete
adminRouter.get('/getadminSingle/:id',getSingleList); //http://localhost:8000/admin/api/getadminSingle
adminRouter.put('/updateAdminList/:id',updateAdminList); //http://localhost:8000/admin/api/updateAdminList

module.exports = adminRouter;