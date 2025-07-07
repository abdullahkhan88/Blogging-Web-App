
import React, { useState } from 'react';

const AdminForgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('If an account with that email exists, a password reset link will be sent.');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">Email Address</span>
            <input
              type="email"
              className="mt-2 w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default AdminForgot;
