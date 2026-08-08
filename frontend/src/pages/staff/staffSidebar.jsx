import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaStar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "./staffSidebar.css";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/authSlice";

const StaffSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

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

      navigate("/signin", { replace: true });
    } catch (error) {
      Swal.fire({
        title: "Logout Failed",
        text: error.response?.data?.message || "Please try again.",
        icon: "error",
      });
    }
  };
  return (
    <div className="staff-sidebar">
      <div className="sidebar-logo">
        <h2>EasyFix</h2>
        <p>Staff Panel</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/staff"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/staff/my-works"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaClipboardList />
          <span>Assigned Works</span>
        </NavLink>

        <NavLink
          to="/staff/staff-reviews"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaStar />
          <span>Customer Reviews</span>
        </NavLink>

        <NavLink
          to="/staff/staff-profile"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <button className="menu-item logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default StaffSidebar;
