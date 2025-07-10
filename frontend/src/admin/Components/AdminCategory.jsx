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
            [name]: value
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/api/CreateCategory`, formData);
        getAllCategory();
        Swal.fire('Success!', 'Your Data Save Successfully.', 'success');
        setFormData({
            category: "",
            status: "",
        })
    };

    const getAllCategory = async () => {
        try {
            let categoryData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/showCategory`);
            setCategoryData(categoryData.data.data);
        } catch (error) {
            console.error("Failed to load category", error)
        }
    }
    useEffect(() => {
        getAllCategory();
    }, []);

    // Delete Category 

    const deleteCategory = async (id) => {
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/deleteCategory/${id}`);
                getAllCategory();
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');

            }
        } catch (error) {
            console.log("Error while Data Deleting", error)
        }

    };

    // Update coding

    const getSingleCategory = async (id) => {
        setUpdateId(id);
        try {
            let resData = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/getCategory/${id}`);
            let data = resData.data.result;
            setFormData({
                category: data.category,
                status: data.status
            });

        } catch (error) {
            console.error()
        }
    };

    const updateCategory = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/api/updateCategory/${updateId}`, formData);
            setUpdateId(null);
            setFormData({ category: "", status: "" });
            getAllCategory();
            Swal.fire("Update", "Category Update Successfully", "success");
        }
        catch (error) {
            console.log(error);
        }
    };




    return (
        <>
            <div className="flex justify-center min-h-screen">
                <div className="flex w-full gap-4">
                    {/* Left Column - 40% */}
                    <div className="w-2/5 p-8 rounded-lg shadow-lg">
                        <h1 className="text-black mb-6 text-2xl font-semibold bg-blue-300 p-2">Add New Blogs Category</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4">
                                <label htmlFor="name" className="text-gray-700 mt-4 text-semibold">Category</label>
                                <input
                                    onChange={HandleChange}
                                    value={formData.category}
                                    id="name"
                                    name="category"
                                    type="text"
                                    placeholder="Enter your Category"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="name" className="text-gray-700 mt-4 text-semibold">Status</label>
                                <select onChange={HandleChange} name="status" id="status" value={formData.status} className="w-full p-3 border border-gray-300 rounded focus:outline-none">

                                    <option value="">Choose Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </select>
                                {
                                    updateId ? (
                                        <button type="button" onClick={updateCategory} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                            Update
                                        </button>
                                    ) : (
                                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                            Submit
                                        </button>
                                    )
                                }
                            </div>
                        </form>
                    </div>

                    {/* Right Column - 60% */}
                    <div className="w-3/5 p-8 rounded-lg shadow-lg text-white">
                        <h2 className="text-2xl text-black font-semibold bg-blue-300 p-2">List Category</h2>
                        <div className="overflow-x-auto mt-5">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                {/* Table Header */}
                                <thead>
                                    <tr className="bg-blue-300 text-white">
                                        <th className="py-3 px-6 text-left">Sr</th>
                                        <th className="py-3 px-6 text-left">Created At</th>
                                        <th className="py-3 px-6 text-left">Category</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-left">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {

                                        categoryData.length > 0 ? (
                                            categoryData.map((item, index) => (

                                                <tr className="border-b text-black" key={item._id}>

                                                    <td className="py-3 px-6">{index + 1}</td>
                                                    <td className="py-3 px-6">{new Date(item.createAt).toLocaleString("en-IN", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                        timeZone: "Asia/Kolkata"
                                                    })}</td>
                                                    <td className="py-3 px-6">{item.category}</td>
                                                    <td className="py-3 px-6">
                                                        {
                                                            item.status === "Active" ? (
                                                                <button className="bg-green-700 text-white px-1 py-1 rounded">
                                                                    {item.status}
                                                                </button>
                                                            ) :
                                                                (<button className="bg-red-600 text-white px-1 py-1 rounded">
                                                                    {item.status}
                                                                </button>)
                                                        }
                                                    </td>
                                                    <td className="py-3 px-6 break-words whitespace-nowrap">
                                                        <button onClick={() => getSingleCategory(item._id)} className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"><FaEdit /></button>
                                                        <button onClick={() => deleteCategory(item._id)} className="bg-red-500 text-white px-2 py-2 mx-1 rounded hover:bg-red-600"><FaTrashAlt /></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                                    Data Not Found
                                                </td>
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
export default AdminCategory;