let express = require('express');
let userLikeRoutes = express.Router();
const AuthMiddleware = require('../../middleware/web_middleware/Authentication');

let { 
    likeBlog,
    dislikes
} = require('../../controllers/webController/LikeController');


userLikeRoutes.put('/like/:id',AuthMiddleware,likeBlog); // http://localhost:8000/web/api/like;
userLikeRoutes.put('/dislikes/:id',AuthMiddleware,dislikes); // http://localhost:8000/web/api/dislikes;

module.exports = userLikeRoutes;
