import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/Authentication/AuthSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.auth.username);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsOpen(false);
    navigate("/");
    setMobileMenuOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 shadow-md relative z-50">
      <div className="flex justify-between items-center">
        {/* Brand Logo */}
        <div className="text-2xl font-bold">
          <span className="text-blue-600 text-3xl font-extrabold">B</span>logging
        </div>

        {/* Hamburger icon */}
        <div className="md:hidden text-2xl" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          {username && (
            <>
              <Link to="/writeBlogs" className="hover:text-gray-300">Write-Blogs</Link>
              <Link to="/myblogs" className="hover:text-gray-300">My Blogs</Link>
            </>
          )}
          {!username ? (
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <div
                onClick={toggleMenu}
                className="w-11 h-11 rounded-full bg-blue-200 text-blue-800 text-xl font-semibold flex items-center justify-center cursor-pointer shadow-md border-2 border-green-700 hover:scale-105 transition-transform duration-200"
                title={username}
              >
                {username?.charAt(0).toUpperCase() || <FaUserCircle size={30} />}
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50 overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <Link to="/changepassword" className="block px-4 py-2 hover:bg-gray-100">Change Password</Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="flex flex-col mt-4 space-y-2 md:hidden">
          <Link to="/" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>About</Link>
          {username && (
            <>
              <Link to="/writeBlogs" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Write-Blogs</Link>
              <Link to="/myblogs" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>My Blogs</Link>
            </>
          )}
          {!username ? (
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200 w-fit"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          ) : (
            <>
              <Link to="/profile" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <Link to="/changepassword" className="hover:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Change Password</Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
