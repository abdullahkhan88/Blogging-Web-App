import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";


const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = useSelector((state) => state.auth.username);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const token = sessionStorage.getItem("user_token");

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/getLoginUserBlog`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setBlogs(res.data || []);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-xl text-gray-600">Loading your blogs...</div>;
  }

  if (blogs.length === 0) {
    return <div className="text-center mt-10 text-lg text-gray-500">You haven't written any blogs yet.</div>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
        >
          <img
            src={blog.photo}
            alt={blog.title}
            className="rounded-md h-48 w-full object-cover mb-4"
          />

          <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
          <p className="text-sm text-gray-500 mb-2">Category: {blog.category}</p>
          <p className="text-sm text-gray-500">
            By <span className="font-medium">{blog.createdBy?.name || username || "Unknown"}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyBlogs;
