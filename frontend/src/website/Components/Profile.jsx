import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    mobile: "",
    profile: "",
    address: "",
    dob:""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = sessionStorage.getItem('user_token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/Profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data.result);
        setFormData({
          username: res.data.result.username || "",
          email: res.data.result.email || "",
          gender: res.data.result.gender || "",
          mobile: res.data.result.mobile || "",
          address: res.data.result.address || "",
          profile: res.data.result.profile || "",
          dob: res.data.result.dob || "",
        });
      } catch (error) {
        console.error("Profile load karne me error aaya:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...formData }));  // UI ke liye update

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("gender", formData.gender);
      data.append("mobile", formData.mobile);
      data.append("address", formData.address);
      data.append("dob", formData.dob);
      if (formData.profile) {
        data.append("profile", formData.profile);  // yeh file object hai
      }

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/web/api/updateProfile`, data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('user_token')}`
        }
      });

      setIsEditing(false);
      Swal.fire({
        title: 'Updated!',
        text: 'Your profile has been updated.',
        icon: 'success',
        confirmButtonText: 'Cool'
      });
    } catch (err) {
      console.error(err);
    }

  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row p-6 gap-6 min-h-[80vh] transition-all duration-500 ease-in-out">

        {/* Left Profile Container */}
        <div className={`${isEditing ? 'w-full' : 'md:w-[30%]'} w-full bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-xl flex flex-col items-center justify-center gap-6 transition-all duration-500`}>
          <div className=" w-24 h-24 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-600 text-5xl shadow-inner">
            {formData.profile && (
              <img
                src={
                  typeof formData.profile === "object"
                    ? URL.createObjectURL(formData.profile)
                    : ""
                }
                alt="Profile"
                className="w-22 h-22 rounded-full object-cover"
              />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">👤 Username</p>
            <h3 className="text-xl font-semibold text-gray-800">
              {user ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Loading..."}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">📧 Email</p>
            <p className="text-gray-700 font-medium">{user?.email || "Loading..."}</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
            >
              Update Profile
            </button>
          )}
        </div>

        {/* Right Container */}
        <div className={`${isEditing ? 'w-full' : 'md:w-[70%]'} bg-gradient-to-br from-white via-indigo-50 to-blue-100 rounded-xl p-6 shadow-xl transition-all duration-500`}>
          {isEditing ? (
            <form className="space-y-6" onSubmit={handleUpdate}>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Enter name"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    disabled
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Enter mobile"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Choose Profile</label>
                  <input
                    type="file"
                    name="profile"
                    onChange={handleFileChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                  >
                  </input>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-2 border border-gray-300 rounded"

                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
                  placeholder="Enter address"
                />
              </div>

              <div className="flex justify-between">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all">Update Profile</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all">Cancel</button>
              </div>
            </form>
          ) : (


            <div className="space-y-4 text-gray-800">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4"> Profile Preview</h2>
              <hr />

              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl shadow-inner">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : "Unknown User"}
                  </h2>
                  <p className="text-gray-500 text-sm">{user?.email || "No email provided"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500">📧 Email Address</p>
                  <p className="text-lg font-semibold text-gray-700">{user?.email || "Not available"}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500">🧑 Gender</p>
                  <p className="text-lg font-semibold text-gray-700 capitalize">{user?.gender || "Not specified"}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500">📞 Mobile Number</p>
                  <p className="text-lg font-semibold text-gray-700">{user?.mobile || "Not available"}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-700">{user?.dob || "Not available"}</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500">📍 Address</p>
                  <p className="text-lg font-semibold text-gray-700">{user?.address || "Not available"}</p>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
