import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTools,
  FaUserTie,
  FaUsers,
  FaClipboardList,
  FaTasks,
  FaMoneyCheckAlt,
  FaWallet,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./adminNavbar.css";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import Swal from "sweetalert2";
import { signOut } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaMapMarkedAlt } from "react-icons/fa";
const AdminNavbar = () => {
  const user = useSelector((state) => state.auth.user) || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be signed out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Sign Out",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/signout`,
        {},
        { withCredentials: true },
      );

      dispatch(signOut());

      await Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
      });

      navigate("/signin");
    } catch (error) {
      Swal.fire({
        title: "Logout Failed",
        text: error.response?.data?.message || "Please try again.",
        icon: "error",
      });
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>EasyFix</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin" end>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/services">
          <FaTools />
          <span>Services</span>
        </NavLink>

        <NavLink to="/admin/staff">
          <FaUserTie />
          <span>Staff</span>
        </NavLink>

        <NavLink to="/admin/users">
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/orders">
          <FaClipboardList />
          <span>Orders</span>
        </NavLink>

        <NavLink to="admin/works-admin">
          <FaTasks />
          <span>Job Assignment</span>
        </NavLink>

        <NavLink to="/admin/salary-management">
          <FaMoneyCheckAlt />
          <span>Payments</span>
        </NavLink>

        <NavLink to="/admin/wallet">
          <FaWallet />
          <span>Wallet</span>
        </NavLink>

        <NavLink to="/admin/location-management">
          <FaMapMarkedAlt />
          <span>Locations</span>
        </NavLink>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminNavbar;
