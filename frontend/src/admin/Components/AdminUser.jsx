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
      Swal.fire('Success!', 'Data Saved Successfully', 'success');
    } catch (error) {
      Swal.fire('Warning!', 'Data Not Saved', 'warning');
    }
  };

  const FetchAllData = async () => {
    try {
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/adminList`);
      setAdminData(res.data.data);
    } catch (error) {
      console.log("Admin Data Not Fetch", error);
    }
  };

  useEffect(() => {
    FetchAllData();
  }, []);

  const DeleteAdmin = async (id) => {
    try {
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/adminDelete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        FetchAllData();
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const EditAdmin = async (id) => {
    setadminid(id);
    try {
      let res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/getadminSingle/${id}`);
      let data = res.data.result;
      Setname(data.name);
      SetUsername(data.username);
      setPassword(data.password);
      SetRole(data.role);
      SetStatus(data.status);
    } catch (error) {
      console.log("update error");
    }
  };

  const UpdateAdmin = async (e) => {
    e.preventDefault();
    const obj = { name, username, password, role, status };
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/api/updateAdminList/${adminid}`, obj);
      Swal.fire('Success!', 'Data Updated Successfully', 'success');
      Setname('');
      SetUsername('');
      setPassword('');
      SetRole('');
      SetStatus('');
      setadminid(null);
      FetchAllData();
    } catch (error) {
      console.log("data update problems", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl font-semibold rounded text-blue-800 mb-4 p-1 bg-blue-100">{adminid ? 'Update Admin' : 'Add Admin User'}</h1>
          <form onSubmit={adminid ? UpdateAdmin : HandleChange} className="space-y-4">
            <input value={name} onChange={(e) => Setname(e.target.value)} required placeholder="Name" className="w-full border border border-purple-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            <input value={username} onChange={(e) => SetUsername(e.target.value)} required placeholder="Username" className="w-full border border border-purple-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder={adminid ? "Leave blank to keep password" : "Password"} required className="w-full border border border-purple-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            <select value={role} onChange={(e) => SetRole(e.target.value)} required className="w-full border border border-purple-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Choose a Role</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
              <option value="Founder">Founder</option>
              <option value="User">User</option>
            </select>
            <select value={status} onChange={(e) => SetStatus(e.target.value)} required className="w-full border border border-purple-300 p-3 rounded-lg">
              <option value="">Choose Status</option>
              <option value="Active">Active</option>
              <option value="In-active">In-Active</option>
            </select>
            <button type="submit" className={`w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 ${adminid ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
              {adminid ? 'Update User' : 'Create User'}
            </button>
          </form>
        </div>

        {/* Right Column - Table */}
        <div className="bg-white p-6 rounded-xl shadow-md overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-semibold rounded text-blue-800 mb-4 p-1 bg-blue-100">Admin User List</h2>
          <table className="min-w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="py-3 px-4 text-left text-blue-800">Name</th>
                <th className="py-3 px-4 text-left text-blue-800">Username</th>
                <th className="py-3 px-4 text-left text-blue-800">Status</th>
                <th className="py-3 px-4 text-left text-blue-800">Role</th>
                <th className="py-3 px-4 text-left text-blue-800">Action</th>
              </tr>
            </thead>
            <tbody>
              {adminData.length ? (
                adminData.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-green-800">{item.username}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.status}</span>
                    </td>
                    <td className="py-3 px-4">{item.role}</td>
                    <td className="py-3 px-4 whitespace-nowrap flex gap-2">
                      <button onClick={() => EditAdmin(item._id)} className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"><FaEdit /></button>
                      <button onClick={() => DeleteAdmin(item._id)} className="p-2 rounded bg-red-500 text-white hover:bg-red-600"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">No admin found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUser;