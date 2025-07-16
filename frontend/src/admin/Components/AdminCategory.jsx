import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AdminCategory = () => {
  const [updateId, setUpdateId] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    status: "",
  });

  const [categoryData, setCategoryData] = useState([]);

  const HandleChange = (e) => {
    let { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/api/CreateCategory`,
      formData
    );
    getAllCategory();
    Swal.fire("Success!", "Your Data Saved Successfully.", "success");
    setFormData({
      category: "",
      status: "",
    });
  };

  const getAllCategory = async () => {
    try {
      let categoryData = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/showCategory`
      );
      setCategoryData(categoryData.data.data);
    } catch (error) {
      console.error("Failed to load category", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const deleteCategory = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You cannot undo this action!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/admin/api/deleteCategory/${id}`
        );
        getAllCategory();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    } catch (error) {
      console.log("Error while deleting data", error);
    }
  };

  const getSingleCategory = async (id) => {
    setUpdateId(id);
    try {
      let resData = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/getCategory/${id}`
      );
      let data = resData.data.result;
      setFormData({
        category: data.category,
        status: data.status,
      });
    } catch (error) {
      console.error("Error fetching category", error);
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/api/updateCategory/${updateId}`,
        formData
      );
      setUpdateId(null);
      setFormData({ category: "", status: "" });
      getAllCategory();
      Swal.fire("Updated!", "Category updated successfully.", "success");
    } catch (error) {
      console.log("Update error", error);
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-80px)]">
        
        {/* Left: Form */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            {updateId ? "Update Blog Category" : "Add New Blog Category"}
          </h2>
          <form onSubmit={updateId ? updateCategory : handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Category</label>
              <input
                onChange={HandleChange}
                value={formData.category}
                name="category"
                type="text"
                placeholder="Enter category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">Status</label>
              <select
                onChange={HandleChange}
                name="status"
                value={formData.status}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose Status</option>
                <option value="Active">Active</option>
                <option value="In-Active">In-Active</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${
                  updateId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {updateId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Table with Scroll */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-y-auto">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">List of Categories</h2>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-blue-100 text-left text-gray-700">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.length > 0 ? (
                categoryData.map((item, index) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50 transition-all">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">
                      {new Date(item.createAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })}
                    </td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => getSingleCategory(item._id)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(item._id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategory;
