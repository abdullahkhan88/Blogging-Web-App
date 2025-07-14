import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions like clearing tokens or session data
    alert('You have been logged out!');
    navigate('/admin-login'); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 h-64">
        <h1 className="text-2xl font-bold mb-4">Are you sure you want to logout?</h1>
        <div className="flex space-x-4">
          <button onClick={handleLogout} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Logout</button>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
