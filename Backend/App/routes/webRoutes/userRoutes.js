let express = require('express');
let userRoutes = express.Router();
const AuthMiddleware = require('../../middleware/web_middleware/Authentication');

let { userInsert,
    userLogin,
    showProfile,
    UpdateProfile,
    ChangePassword

} = require('../../controllers/webController/UserControllers');

const uploadUser = require('../../middleware/web_middleware/uploadUser')

userRoutes.post('/userInsert', userInsert); // http://localhost:8000/web/api/userInsert;
userRoutes.post('/userLogin', userLogin); // http://localhost:8000/web/api/userLogin;
userRoutes.get('/Profile', AuthMiddleware, showProfile); //http://localhost:8000/web/api/Profile;
userRoutes.put('/updateProfile', AuthMiddleware,uploadUser.single('profile'),UpdateProfile); //http://localhost:8000/web/api/updateProfile;
userRoutes.put('/changepassword', AuthMiddleware, ChangePassword); //http://localhost:8000/web/api/changepassword;
module.exports = userRoutes;