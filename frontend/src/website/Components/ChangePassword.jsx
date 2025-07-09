import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cnfPassword, setCnfPassword] = useState('');
    const [Error, setError] = useState('');

    const HandleUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== cnfPassword) {
            setError("New password and confirm password do not match.");
            return;
        }
        setError("");
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/web/api/changepassword`,
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('user_token')}`
                    }
                }

            );
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: res.data.message || 'Password changed successfully!',
            });
            setOldPassword("");
            setNewPassword("");
            setCnfPassword("");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.response?.data?.message || 'Failed to change password.',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800"> Change Password</h2>
                <p className="text-red-500">{Error}</p>
                <form onSubmit={HandleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Old Password</label>
                        <input
                            onChange={(e) => setOldPassword(e.target.value)}
                            type="password"
                            value={oldPassword}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter old password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">New Password</label>
                        <input
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            value={newPassword}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Re-entered New Password</label>
                        <input
                            onChange={(e) => setCnfPassword(e.target.value)}
                            type="password"
                            value={cnfPassword}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter new password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
