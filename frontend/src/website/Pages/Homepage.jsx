import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, fetchCategories, filterByCategory } from '../../features/blogs/blogSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Card = ({ blogs, username }) => {

  const handleReadMore = () => {
    if (!username) {
      toast.info('Please login to read this blog.', {
        position: "top-right",
        style: {
          width: "400px", 
          height: "100px",
          fontSize: "20px",
          color: "#073ded",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
          borderLeft: "6px solid rgba(39, 159, 224, 0.88)", // warning yellow stripe
          padding: "1rem 1.2rem",
        }
      });
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-62 overflow-hidden">

        {/* homepage photo ka path diya gya hai by condition kyoki dono aalg folder mein hai */}
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={`${import.meta.env.VITE_API_URL}/uploads/${blogs.createdByRole === 'User' ? 'UserBlog' : ''}/${blogs.photo}`}
          alt="Blog"
        />
        <div className="absolute top-2 left-2 bg-white/80 text-gray-700 text-xs px-3 py-1 rounded-full shadow">
          {new Date(blogs.createdAt).toLocaleDateString('en-IN')}
        </div>
      </div>
      <div className="p-5">
        <span className="inline-block mb-3 text-xs font-semibold text-white bg-gradient-to-r from-sky-400 to-emerald-400 px-4 py-1 rounded-full shadow">
          {blogs.category}
        </span>
        <h2 className="text-xl font-extrabold text-gray-800 line-clamp-2 mb-2">
          {blogs.title || 'Untitled Blog'}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-5">
          {blogs.description}
        </p>

        <div className="flex justify-between items-center">
          {username ? (
            <Link
              to={`/blogsDetails/${blogs._id}`}
              className="inline-block px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow hover:scale-105 hover:shadow-md transition-all duration-300"
            >
              Read More →
            </Link>
          ) : (
            <button
              onClick={handleReadMore}
              className="inline-block px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow hover:scale-105 hover:shadow-md transition-all duration-300"
            >
              Read More →
            </button>
          )}

          <div className="flex items-center gap-1 text-gray-600">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>{blogs.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = ({ category, onClick }) => {
  return (
    <button
      className="px-5 py-2 rounded-full border text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm hover:shadow-md"
      onClick={() => onClick(category.category)}
    >
      {category.category}
    </button>
  );
};

function Homepage() {
  const dispatch = useDispatch();
  const { categories, filteredBlogs, status } = useSelector(state => state.blog);
  const { username } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(filterByCategory(category));
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="p-4 shadow bg-gradient-to-r from-blue-200 to-indigo-100 rounded-xl mb-6">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              className="px-5 py-2 rounded-full border text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm hover:shadow-md"
              onClick={() => handleCategoryClick("All")}
            >
              All
            </button>
            {categories.length > 0 ? (
              categories.map(cat => (
                <Button key={cat._id} category={cat} onClick={handleCategoryClick} />
              ))
            ) : (
              <p>Categories not found.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {status === 'loading' ? (
            <p className="text-center col-span-full">Loading blogs...</p>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <Card key={blog._id} blogs={blog} username={username} />
            ))
          ) : (
            <p className="text-center col-span-full">No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
