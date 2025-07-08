// App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

// admin api Protect File
import ProtectedRoute from "./admin/Components/ProtectRoute";
import UserProtectedRoute from "./website/Components/UserProtectRoute";

// admin import
import SideBar from "./admin/Pages/Sidebar";
import AdminLogin from "./admin/Components/AdminLogin";
import DashBoard from "./admin/Components/AdminDashBoard";
import AdminBlogs from "./admin/Components/AdminBlogs";
import AdminCategory from "./admin/Components/AdminCategory";
//import AdminLogout from "./admin/Components/AdminLogout";
import AdminUser from "./admin/Components/AdminUser";
import AdminForgot from "./admin/Components/AdminForgot";
import PendingComments from "./admin/Pages/PendingComments";
import PendingUserBlog from "./admin/Pages/PendingUserBlog";

// user import
import Homepage from "./website/Pages/Homepage";
import NavBar from "./website/Pages/NavBar";
import Register from "./website/Components/Register";
import Login from "./website/Components/Login";
import BlogsDetails from "./website/Pages/BlogsDetails";
import Profile from "./website/Components/Profile";
import About from "./website/Pages/About";
import ChangePassword from "./website/Components/ChangePassword";
import WriteBlogs from "./website/Pages/WriteBlogs";
import MyBlogs from "./website/Pages/MyBlogs";
import Footer from "./website/Pages/Footer";

// 👇 Yeh nested wrapper banaya gaya hai Router ke andar useLocation ke liye
function AppWrapper() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/admin");
 
  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/writeBlogs" element={
          <UserProtectedRoute>
            <WriteBlogs />
          </UserProtectedRoute>} />
        <Route path="/blogsDetails/:id" element={<BlogsDetails/>} />
        <Route path="/profile" element={
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        } />
        <Route path="/myblogs" element={
          <UserProtectedRoute>
            <MyBlogs />
          </UserProtectedRoute>
        } />
        
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <SideBar />
          </ProtectedRoute>
        }>
          <Route index="dashboard" element={<DashBoard />} />
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="blog" element={<AdminBlogs />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="user" element={<AdminUser />} />
          
          <Route path="forget" element={<AdminForgot />} />
          <Route path="pendingComment" element={<PendingComments/>} />
          <Route path="pendingBlogs" element={<PendingUserBlog/>} />
        </Route>
      </Routes>
      {!hideNav && <Footer/>}
    </>
  );
}

// 👇 Yeh Router wrap karta hai sab kuch
function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
      
    </BrowserRouter>
  );
}

export default App;
