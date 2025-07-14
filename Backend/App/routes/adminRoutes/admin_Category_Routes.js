const express = require('express');
const adminCategoryRoutes = express.Router();
const AdminAuthMiddleware = require('../../middleware/admin_middleware/AdminAuthentication');
let {
    createCategory,
    showCategory,
    deleteCategory,
    getSingleCategory,
    updateCategory
} = require('../../controllers/adminController/admin_category_controller');

adminCategoryRoutes.post('/CreateCategory',createCategory); //http://localhost:8000/admin/api/CreateCategory;
adminCategoryRoutes.get('/showCategory',showCategory); //http://localhost:8000/admin/api/showCategory;
adminCategoryRoutes.delete('/deleteCategory/:id',deleteCategory); //http://localhost:8000/admin/api/deleteCategory;
adminCategoryRoutes.get('/getCategory/:id',getSingleCategory); //http://localhost:8000/admin/api/getCategory;
adminCategoryRoutes.put('/updateCategory/:id',updateCategory); //http://localhost:8000/admin/api/updateCategory;


module.exports = adminCategoryRoutes;