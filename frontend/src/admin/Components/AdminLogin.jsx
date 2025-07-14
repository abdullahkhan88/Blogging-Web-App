import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

    const navigate = useNavigate();


    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);



    const handleChange = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/api/adminlogin`, {
                username,
                password
            });
            const token = response.data.token;
            sessionStorage.setItem("token", token);
            navigate("/admin");
            setMessage(response.data.message || 'Login successful');
            setIsError(false);
            // 🟢 Yahin pe decode karke username bhi save kar lo
            const decoded = jwtDecode(token);
            sessionStorage.setItem("username", decoded.username); 
            
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
            setIsError(true);
        };
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-indigo-700 bg-green-300 p-3 rounded mb-6">Admin</h2>
                    <div className="flex justify-center">
                        <img src="public/User_icon.png" className="w-20" />
                    </div>
                    <div>
                        {Message && (
                            <p className={`mb-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>{Message}</p>
                        )}
                    </div>
                    <form onSubmit={handleChange}>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={username}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Login
                        </button>
                        <div className="flex justify-center">
                            <Link to="/admin/forget" className="text-indigo-500 mt-3">Forget Password ?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default AdminLogin