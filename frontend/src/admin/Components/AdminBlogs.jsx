import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect, use } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const AdminBlogs = () => {

  const [category, setCategory] = useState([]); // category ko show karna ke liye data iss page pe laye gya hai
  const [blogData, setBlogsData] = useState([]);
  const [blogId, setblogId] = useState('');
  const token = sessionStorage.getItem("token");


  const getAllCategory = async () => {
    try {
      let categoryData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showCategory`);// ye data dusre page ke api se aa raha 
      let category = categoryData.data.data;
      let blogsData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showblogs`); // blogs data ko show karne ke liye table mein

      setBlogsData(blogsData.data.data);
      setCategory(category);
    } catch (error) {
      console.error("Failed to load category", error)
    }
  }
  useEffect(() => {
    getAllCategory();
  }, []);


  // Create Blogs Coding

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    photo: "" // make sure this name matches the `name` attribute in your input
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value
    });

  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post(`${import.meta.env.VITE_API_URL}/admin/api/createblogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      Swal.fire('Success!', 'Your Data Save Successfully.', 'success');
      getAllCategory();
      setFormData({
        category: "",
        title: "",
        description: "",
        photo: ""
      })
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Something went wrong.', 'error');

    }
  };

  const deleteBlogs = async (id) => {

    try {

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot undo this action!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/deleteblogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }

        });
        getAllCategory();
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');

      }
    } catch (error) {
      console.log("Error while Data Deleting", error)
    }

  };

  const getSingleBlog = async (id) => {
    try {
      setblogId(id);
      let resData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/getsingleblogs/${id}`);
      let data = resData.data.result
      setFormData({
        category: data.category,
        title: data.title,
        description: data.description,
        photo: data.photo
      });
    } catch (error) {
      console.error(error);
    }

  }

  const updateblogs = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/api/updateblogs/${blogId}`, formData);
      setblogId(null);
      setFormData({ category: "", title: "", description: "" });
      getAllCategory();
      Swal.fire("Update", "Category Update Successfully", "success");
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="flex justify-center min-h-screen overflow-x-hidden">
        <div className="flex w-full gap-4">
          {/* Left Column - 40% */}
          <div className="w-2/5 p-8 rounded-lg shadow-lg">
            <h1 className="text-black mb-6 font-semibold text-2xl bg-blue-300 p-2">Add New Blogs Category</h1>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <label htmlFor="category" className="block text-gray-700">Select a Category</label>
                <select
                  id="category"
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a category</option>
                  {category.map((item, index) => (
                    <option key={index} value={item.category}>
                      {item.category}
                    </option>
                  ))}
                </select>

                <div className="max-w-full">
                  <label htmlFor="file-upload" className="block text-gray-700 mb-2">Upload an Image</label>
                  <input
                    onChange={handleChange}
                    required
                    name="photo"
                    id="file-upload"
                    type="file"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <label htmlFor="title" className="text-gray-700">Title</label>
                <input
                  onChange={handleChange}
                  required
                  name="title"
                  id="title"
                  type="text"
                  value={formData.title}
                  placeholder="Enter your title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="max-w-full">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    onChange={handleChange}
                    value={formData.description}
                    name="description"
                    id="message"
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {
                  blogId ?
                    (<button onClick={updateblogs} type="button" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">
                      Update
                    </button>)
                    :
                    (<button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                      Submit
                    </button>)
                }

              </div>
            </form>
          </div>

          {/* Right Column - 60% */}
          <div className="w-3/5 p-8 rounded-lg shadow-lg ">
            <h2 className="text-2xl text-black font-semibold bg-blue-300 p-2">Show Blogs List</h2>
            <div className="overflow-x-auto mt-5">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-blue-300 text-white">
                    <th className="py-3 px-6 text-left">Sr</th>
                    <th className="py-3 px-6 text-left">Thumbnail</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    blogData.length > 0 ? (
                      blogData.map((item, index) => (
                        <tr className="border-b text-black" key={index}>
                          <td className="py-3 px-6">{index + 1}</td>
                          <td className="py-3 px-6">
                            <img src={`${import.meta.env.VITE_API_URL}/uploads/${item.photo}`} className="w-8 h-8" alt="Thumbnail" />
                          </td>
                          <td className="py-3 px-6">{item.category}</td>

                          {/* Title with text limit and tooltip */}
                          <td className="py-3 px-6" title={item.title}>
                            {item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title}
                          </td>

                          {/* Description with text limit and tooltip */}
                          <td className="py-3 px-6" title={item.description}>
                            {item.description.length > 50 ? item.description.slice(0, 50) + '...' : item.description}
                          </td>

                          <td className="py-3 px-6 break-words whitespace-nowrap">
                            <button onClick={() => getSingleBlog(item._id)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                              <FaEdit />
                            </button>
                            <button onClick={() => deleteBlogs(item._id)} className="bg-red-500 text-white p-2 mx-1 rounded hover:bg-red-600">
                              <FaTrashAlt />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b text-black">
                        <td className="text-center py-3 px-6" colSpan={6}>No Data Found</td>
                      </tr>
                    )
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


    </>
  );
}
export default AdminBlogs;