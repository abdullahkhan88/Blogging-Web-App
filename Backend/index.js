require("dotenv").config();
const connectDB = require('./App/dbConnection/db');
let express = require('express');
const path = require('path');
const userRoutes = require('./App/routes/webRoutes/userRoutes');
const userCommentRoutes = require('./App/routes/webRoutes/commentRoutes');
const adminRouter = require('./App/routes/adminRoutes/admin_UserRoutes');
const adminCategoryRoutes = require('./App/routes/adminRoutes/admin_Category_Routes');
const adminBlogs = require('./App/routes/adminRoutes/admin_Blogs_Routes');
const adminCommentRoutes = require('./App/routes/adminRoutes/admin_Comment_Routes');
const userLikeRoutes = require('./App/routes/webRoutes/LikeRoute');
const writeBlogRoutes = require('./App/routes/webRoutes/writeBlogRoute');
const cors = require('cors');



let app = express();
app.use(cors());
app.use(express.json());
connectDB();// database call
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
  origin: [
    "http://localhost:5173", // local dev (optional)
    "https://blogging-web-app-server.onrender.com" // 🟢 your frontend URL
  ],
  credentials: true
}));

app.use('/web/api', userRoutes);
app.use('/web/api', userCommentRoutes);
app.use('/web/api', userLikeRoutes);
app.use('/web/api', writeBlogRoutes);

//http://localhost:8000/web/api/userInsert;



// admin Api

app.use('/admin/api', adminRouter);
app.use('/admin/api', adminCategoryRoutes);
app.use('/admin/api', adminBlogs);
app.use('/admin/api', adminCommentRoutes);

app.get("/", (req,res)=>{
    res.send("this is server page")
})

//http://localhost:8000/admin/api/adminInsert;
//http://localhost:8000/admin/api/adminlogin

app.listen(process.env.PORT, () => {
    console.log(`server is Running on port ${process.env.PORT}`)
})
