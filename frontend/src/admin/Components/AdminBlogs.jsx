import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const AdminBlogs = () => {
  const [category, setCategory] = useState([]);
  const [blogData, setBlogsData] = useState([]);
  const [blogId, setblogId] = useState("");
  const token = sessionStorage.getItem("token");

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    photo: ""
  });

  const getAllCategory = async () => {
    try {
      const categoryData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showCategory`);
      const blogsData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showblogs`);
      setCategory(categoryData.data.data);
      setBlogsData(blogsData.data.data);
    } catch (error) {
      console.error("Failed to load category", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/api/createblogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      Swal.fire("Success!", "Blog created successfully.", "success");
      getAllCategory();
      setFormData({ category: "", title: "", description: "", photo: "" });
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  const deleteBlogs = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You cannot undo this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/deleteblogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        getAllCategory();
        Swal.fire("Deleted!", "Blog deleted successfully.", "success");
      }
    } catch (error) {
      console.log("Error while deleting blog", error);
    }
  };

  const getSingleBlog = async (id) => {
    try {
      setblogId(id);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/getsingleblogs/${id}`);
      const data = res.data.result;
      setFormData({
        category: data.category,
        title: data.title,
        description: data.description,
        photo: ""
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateblogs = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/api/updateblogs/${blogId}`, formData);
      setblogId(null);
      setFormData({ category: "", title: "", description: "", photo: "" });
      getAllCategory();
      Swal.fire("Updated!", "Blog updated successfully.", "success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            {blogId ? "Update Blog" : "Create New Blog"}
          </h2>
          <form onSubmit={blogId ? updateblogs : handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a category</option>
                {category.map((item, index) => (
                  <option key={index} value={item.category}>
                    {item.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Thumbnail</label>
              <input
                type="file"
                name="photo"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required={!blogId}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Write blog description"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
                blogId ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {blogId ? "Update Blog" : "Create Blog"}
            </button>
          </form>
        </div>

        {/* Right - Table */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Blog List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-blue-100 text-gray-700">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Thumbnail</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {blogData.length > 0 ? (
                  blogData.map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <img src={item.photo} alt="thumbnail" className="w-10 h-10 object-cover rounded" />
                      </td>
                      <td className="px-4 py-2">{item.category}</td>
                      <td className="px-4 py-2" title={item.title}>
                        {item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}
                      </td>
                      <td className="px-4 py-2" title={item.description}>
                        {item.description.length > 40 ? item.description.slice(0, 40) + "..." : item.description}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                        <button
                          onClick={() => getSingleBlog(item._id)}
                          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteBlogs(item._id)}
                          className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
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

export default AdminBlogs;
