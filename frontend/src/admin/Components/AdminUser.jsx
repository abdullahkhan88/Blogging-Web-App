import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AdminUser = () => {

    const [adminData, setAdminData] = useState([]);
    const [adminid, setadminid] = useState(null);

    const [name, Setname] = useState('');
    const [username, SetUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, SetRole] = useState('');
    const [status, SetStatus] = useState('');
    



    const HandleChange = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/api/adminInsert`, {
                name,
                username,
                password,
                role,
                status
            });
            e.target.reset();
            FetchAllData();
            Swal.fire({
                title: 'Success!',
                text: "Data Save Successfully",
                icon: 'success',
                confirmButtonText: 'OK'
            });
            console.log("Data Save Successfully", res.data);

        } catch (error) {
            Swal.fire({
                title: 'warning!',
                text: "Data Not Save Successfully",
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            console.log("Failed to Save", error);
        }

    }

    // Fetch Data And Show in Table

    const FetchAllData = async () => {
        try {
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/adminList`);
            setAdminData(res.data.data);
            
        } catch (error) {
            console.log("Admin Data Not Fetch", error);
        }
    }
    useEffect(() => {
        FetchAllData();
    }, []);

    // Delete Admin Data coding

    const DeleteAdmin = async (id) =>{
        try{
            let token = sessionStorage.getItem('token');
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/adminDelete/${id}`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                FetchAllData();
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
            }   
            
        }catch(error){
            Swal.fire('Error!', 'Something went wrong.', 'error');
        }

    }

    // Edit Admin Data

    const EditAdmin = async (id)=>{
        setadminid(id);
        try{
            let res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/getadminSingle/${id}`);
            let data = res.data;
            Setname(data.result.name)
            SetUsername(data.result.username)
            setPassword(data.result.password)
            SetRole(data.result.role)
            SetStatus(data.result.status)
        }catch(error){
            console.log("update error")
        }
    }

    const UpdateAdmin = async (e) =>{
        e.preventDefault();
        let obj ={
            name,
            username,
            password,
            role,
            status
        }
        try{
            let DataRes = await axios.put(`${import.meta.env.VITE_API_URL}/admin/api/updateAdminList/${adminid}`,obj); 
            Swal.fire({
                title: 'Success!',
                text: "Data Update Successfully",
                icon: 'success',
                confirmButtonText: 'OK'
            });
            Setname('');
            SetUsername('');
            setPassword('');
            SetRole('');
            SetStatus('');
            setadminid(null);
            FetchAllData();
            
        }catch(error)
        {
            console.log("data save problems",error)
        }
    }
     

    return (
        <>
            <div className="flex justify-center min-h-screen">
                <div className="flex w-full gap-4">
                    {/* Left Column - 40% */}
                    <div className="w-2/5 p-8 rounded-lg shadow-lg">
                        <h1 className="text-black mb-6 text-2xl text-semibold bg-blue-300 p-2">Add Admin User</h1>
                        <form onSubmit={HandleChange}>
                            <div className="flex flex-col gap-3">

                                <label htmlFor="name" className="text-gray-700 mt-3 text-semibold">Name</label>
                                <input
                                    value={name}
                                    id="name"
                                    onChange={(e) => Setname(e.target.value)}
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="Username" className="text-gray-700 mt-3 text-semibold">Username</label>
                                <input
                                     value={username}
                                    required
                                    id="username"
                                    onChange={(e) => SetUsername(e.target.value)}
                                    type="text"
                                    placeholder="Enter your Username"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="Password" className="text-gray-700 mt-3 text-semibold">Password</label>
                                <input
                                    value={password || ""}
                                    required
                                    id="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder={adminid ? "Leave blank to keep existing password" : "Enter your password"}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <label htmlFor="Role" className="block text-gray-700 mb-2">Select a Role</label>
                                <select
                                     value={role}
                                    required
                                    id="role"
                                    onChange={(e) => SetRole(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" >Choose a role</option>
                                    <option value="HR">HR</option>
                                    <option value="Admin">admin</option>
                                    <option value="Founder">Founder</option>
                                    <option value="User">User</option>
                                </select>
                                <label htmlFor="status" className="block text-gray-700 mb-2">Select a Status</label>
                                <select
                                    value={status}
                                    required
                                    id="status"
                                    onChange={(e) => SetStatus(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose a status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-active">In-Active</option>
                                </select>
                               
                                {
                                    adminid ? 
                                    <button type="button" onClick={UpdateAdmin} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    Update
                                  </button>
                                  :
                                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                  submit
                                  </button>
                                }
                                

                            </div>
                        </form>
                    </div>

                    {/* Right Column - 60% */}
                    <div className="w-3/5 p-8 rounded-lg shadow-lg text-white">
                        <h2 className="text-2xl text-black text-semibold bg-blue-300 p-2">Admin User List</h2>
                        <div className="overflow-x-auto mt-5">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                                {/* Table Header */}
                                <thead>
                                    <tr className="bg-blue-300 text-white">
                                        <th className="py-3 px-6 text-left">Name</th>
                                        <th className="py-3 px-6 text-left">Username</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-left">Role</th>
                                        <th className="py-3 px-6 text-left">Action</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>

                                    {
                                        adminData.length >= 1 ? (

                                            adminData.map((item,index)=>(
                                                <tr className="border-b text-black">
                                                <td className="py-3 px-6">{item.name}</td>
                                                <td className="py-3 px-6">{item.username}</td>
                                                <td className="py-3 px-6">
                                                    {
                                                        item.status == "Active" ? 
                                                        <button className="bg-green-700 text-white px-1 py-1 rounded hover:bg-green-800">
                                                            {item.status}
                                                            </button>
                                                        :  <button className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-600">
                                                            {item.status}
                                                        </button>
                                                    }
                                                    
                                                </td>
                                                <td className="py-3 px-6">{item.role}</td>
                                                <td className="py-3 px-6 whitespace-nowrap">
                                                    <button onClick={()=>EditAdmin(item._id)} className="bg-blue-500 text-white px-3 py-3 rounded hover:bg-blue-600"><FaEdit /></button>
                                                    <button onClick={()=>DeleteAdmin(item._id)} className="bg-red-500 text-white px-3 py-3 mx-1 rounded hover:bg-red-600"><FaTrashAlt /></button>
                                                </td>
                                            </tr>
                                            ))
                                        ) : 
                                        <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                          Data Not Found
                                        </td>
                                      </tr>
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
export default AdminUser