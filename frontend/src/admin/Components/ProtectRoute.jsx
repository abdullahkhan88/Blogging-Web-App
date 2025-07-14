
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Agar token nahi mila toh login page pe redirect kar do
    return <Navigate to="/admin-login" replace />;
  }

  // Token hai toh original component render karo
  return children;
};

export default ProtectedRoute;