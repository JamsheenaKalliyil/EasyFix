import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const AdminProtectedRoutes = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (!user) {
    Swal.fire("Please Sign In", "Login to continue.", "warning");
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    Swal.fire("Access Denied", "Only admins can access this page.", "error");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoutes;
