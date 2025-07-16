import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const WriteBlog = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]); // for fetched categories


  // Fetch categories
  const fetchCategories = async () => {

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showCategory`);
      //console.log(response.data.data)
      setCategories(response.data.data || []); // adjust according to API response shape

    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  //  Fetch blogs
  const fetchBlogs = async () => {
    try {
      let token = sessionStorage.getItem("user_token");
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/getBlogs`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  //  On mount, fetch both blogs and categories
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill all required fields!',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      if (photo) formData.append("photo", photo);

      const token = sessionStorage.getItem("user_token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/web/api/writeBlog`,
        formData,
        {
          headers:{
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Blog created successfully ',
          timer: 2000,
          showConfirmButton: false,
        });

        //  Clear the form
        setTitle('');
        setCategory('');
        setDescription('');
        setPhoto(null);

        // Refresh the blog list
        fetchBlogs();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Blog could not be created ',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong ',
      });
    }
  };


  //  Delete blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("user_token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/web/api/deleteBlog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">

        {/* Left Form */}
        <div className="md:w-2/5 w-full bg-white rounded-3xl shadow-xl p-8 border border-purple-300">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6"> Create Blog</h2>
          {message && <p className="text-center mb-4 font-semibold text-red-600">{message}</p>}

          <form className="space-y-5" onSubmit={handleSubmit} encType="multipart/form-data">
            {/*  Dynamic Category Options */}
            <select
              className="w-full px-4 py-3 border border-purple-300 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>{cat.category}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter Blog Title"
              className="w-full px-4 py-3 border border-purple-300 rounded-lg text-lg focus:ring-2 focus:ring-purple-400 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              rows="5"
              placeholder="Write blog description..."
              className="w-full px-4 py-3 border border-purple-300 rounded-lg text-base focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>

            <input
              type="file"
              className="w-full border border-dashed border-purple-300 p-3 rounded-lg text-purple-600 file:bg-purple-100 file:border-none file:rounded-md file:mr-3"
              onChange={(e) => setPhoto(e.target.files[0])}
            />

            <div className="flex justify-between">
              <button
                type="reset"
                onClick={() => {
                  setTitle('');
                  setCategory('');
                  setDescription('');
                  setPhoto(null);
                  setMessage('');
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Publish
              </button>
            </div>
          </form>
        </div>

        {/* Right Blog List */}
        <div className="md:w-3/5 w-full bg-white rounded-3xl shadow-xl p-6 border border-purple-300 overflow-x-auto max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-4 text-purple-700"> Blog List</h2>

          <div className="overflow-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 font-bold text-purple-700 uppercase">Image</th>
                  <th className="px-6 py-3 font-bold text-purple-700 uppercase">Title</th>
                  <th className="px-6 py-3 font-bold text-purple-700 uppercase">Category</th>
                  <th className="px-6 py-3 font-bold text-purple-700 uppercase">Status</th>
                  <th className="px-6 py-3 font-bold text-purple-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-purple-50 transition">
                      <td className="px-6 py-4">
                        <img
                          src={blog.photo}
                          alt="Blog"
                          className="w-14 h-14 object-cover rounded-md border"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4 text-purple-600 font-semibold">{blog.category}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`${blog.isApproved
                            ? "bg-green-100 text-green-800"
                            : blog.isRejected
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                            } text-xs font-semibold px-3 py-1 rounded-full`}
                        >
                          {blog.isApproved ? "Approved" : blog.isRejected ? "Rejected" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="bg-red-500 text-white px-2 py-1.5 rounded-md hover:bg-red-600 transition text-sm shadow-sm"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WriteBlog;
