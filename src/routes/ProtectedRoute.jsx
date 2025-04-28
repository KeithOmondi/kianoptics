import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user || {});

  console.log("ProtectedRoute -> loading:", loading);
  console.log("ProtectedRoute -> isAuthenticated:", isAuthenticated);

  // CASE 1: Still loading user data
  if (loading === undefined || loading === true) {
    console.log("ProtectedRoute -> Still loading user data...");
    return null; // You can show a loader/spinner here if you want
  }

  // CASE 2: Not authenticated after loading
  if (!isAuthenticated) {
    console.log("ProtectedRoute -> Not authenticated, redirecting...");
    return <Navigate to="/login" replace />;
  }

  // CASE 3: Authenticated
  console.log("ProtectedRoute -> Authenticated, rendering child components...");
  return children;
};

export default ProtectedRoute;
