import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("user_token");
  
  if (!token) {
    // Agar token nahi mila toh login page pe redirect kar do
    return <Navigate to="/signup" replace />;
  }

  // Token hai toh original component render karo
  return children;
};

export default UserProtectedRoute;