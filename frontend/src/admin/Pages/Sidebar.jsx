import { useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaTimes,
  FaBars,
  FaLongArrowAltRight,
  FaUser,
  FaClock,
} from "react-icons/fa";
import { FaBlog } from "react-icons/fa6";
import { Outlet, Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const username = sessionStorage.getItem("username");
  const userFirstLatter = username?.charAt(0).toUpperCase();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/admin-login");
    setIsOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-[60%] md:w-[15%] bg-blue-50 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="text-lg font-bold p-4 border-b border-blue-100">Dashboard</div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaHome size={20} />
              <Link to="dashboard" onClick={() => setIsOpen(false)} className="w-full">
                Dashboard
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaShoppingCart size={20} />
              <Link to="category" onClick={() => setIsOpen(false)} className="w-full">
                Category
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaBlog size={20} />
              <Link to="blog" onClick={() => setIsOpen(false)} className="w-full">
                Blogs
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaUser size={20} />
              <Link to="user" onClick={() => setIsOpen(false)} className="w-full">
                Add User
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaClock size={20} />
              <Link to="pendingComment" onClick={() => setIsOpen(false)} className="w-full">
                Comments
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <FaBlog size={20} />
              <Link to="pendingBlogs" onClick={() => setIsOpen(false)} className="w-full">
                User Blogs
              </Link>
            </li>
            <li className="p-4 flex items-center space-x-2 hover:bg-blue-300 cursor-pointer">
              <button
                onClick={handleLogout}
                className="cursor-pointer w-full flex items-center gap-1"
              >
                <FaLongArrowAltRight size={22} className="mt-0.5" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? "ml-0" : "ml-0"} md:ml-[15%]`}
      >
        {/* Header */}
        <header
          className={`fixed top-0 z-50 bg-blue-400 shadow-md px-4 py-2 flex items-center transition-all duration-300 ease-in-out
          ${isOpen ? "w-[60%]" : "w-full"} md:left-[15%] md:w-[85%]`}
        >
          {/* Mobile menu open button */}
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 md:hidden"
            >
              <FaBars size={24} />
            </button>
          )}

          {/* Mobile close button (Right side) */}
          {isOpen && (
            <div className="flex justify-end w-full md:hidden">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaTimes size={24} />
              </button>
            </div>
          )}

          {/* Desktop user icon on right */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="bg-blue-200 h-12 w-12 flex justify-center items-center rounded-full">
              {userFirstLatter ? (
                <span className="text-2xl text-green-700 font-bold">{userFirstLatter}</span>
              ) : (
                <FaUser className="text-2xl" />
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 mt-16">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SideBar;
