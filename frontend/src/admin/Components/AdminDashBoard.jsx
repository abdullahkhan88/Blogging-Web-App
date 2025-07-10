import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaBlog, FaUserShield } from "react-icons/fa";

const StatCircle = ({ icon: Icon, label, value, color }) => {
  return (
    <div
      className={`bg-white/20 backdrop-blur-md rounded-full w-48 h-48 flex flex-col justify-center items-center shadow-lg border-2 border-${color}-500 hover:scale-105 transition-transform cursor-pointer`}
      style={{ borderColor: color }}
    >
      <Icon className={`text-6xl mb-3 text-${color}-500`} />
      <h3 className={`text-lg font-semibold text-${color}-600`}>{label}</h3>
      <p className={`text-4xl font-bold text-${color}-700 mt-1`}>{value}</p>
    </div>
  );
};

const DashBoard = () => {
  const [userCount, setUserCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [penddingBlogCount, setPenddingBlogCount] = useState(0)

  // http://localhost:8000/admin/api/countblogs





  useEffect(() => {
    const fetchCount = async (endpoint, setter, label) => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/api/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setter(res.data.count || 0);
      } catch (err) {
        console.error(`${label} fetch error:`, err);
      }
    };

    const fetchPenddingBlogCount = async (endpoints, setters, labels) => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/web/api/${endpoints}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setters(res.data.count || 0);
      } catch (err) {
        console.error(`${labels} fetch error:`, err);
      }
    };


    // http://localhost:8000/web/api/getPendingCount
    fetchCount("usercount", setUserCount, "User count");
    fetchCount("blogscount", setBlogCount, "Blog count");
    fetchPenddingBlogCount("getPendingBlogCount", setPenddingBlogCount, "Blog count")
    
  }, []);

  return (
    <div className="h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50 p-10">
      <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-xl p-12 max-w-5xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-white mb-12 drop-shadow-lg">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 justify-center">
          {/* Baad me aur cards bhi add kar sakta hai */}

          <StatCircle icon={FaUsers} label="Pennding Users" value={penddingBlogCount} color="purple" />
          <StatCircle icon={FaBlog} label="Blogs" value={blogCount} color="blue" />
          <StatCircle icon={FaUserShield} label="Admins" value={userCount} color="green" />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
