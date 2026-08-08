import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaMapMarkerAlt,
  FaStar,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import "./profileSidebar.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils/urls";
import { signOut } from "../../redux/authSlice";

const ProfileSidebar = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(`${BASE_URL}/signout`, {}, { withCredentials: true });

      dispatch(signOut());

      Swal.fire({
        icon: "success",
        title: "Logged out",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <aside className="profileSidebar">
      <div className="profileSidebarHeader">
        <div className="profileSidebarAvatar">
          {" "}
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h5 className="profileSidebarName">{user.name}</h5>

        {/* <p>Manage your account</p> */}
      </div>

      <nav className="profileSidebarMenu">
        <NavLink
          to="/user-profile"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/user-orders"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaBoxOpen />
          <span>My Orders</span>
        </NavLink>

        <NavLink
          to="/my-favorites"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaHeart />
          <span>My Favorites</span>
        </NavLink>

        <NavLink
          to="/user-address"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaMapMarkerAlt />
          <span>Saved Addresses</span>
        </NavLink>

        <NavLink
          to="/my-reviews"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaStar />
          <span>My Reviews</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "profileSidebarItem active" : "profileSidebarItem"
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <button className="profileSidebarItem logoutBtn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
