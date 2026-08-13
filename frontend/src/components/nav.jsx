import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo4.png";
import "./nav.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/authSlice";
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import Swal from "sweetalert2";
import { FaMapMarkerAlt } from "react-icons/fa";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || null;

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

  const checkAvailability = async () => {
    const { value: pincode } = await Swal.fire({
      title: "Check Service Availability",
      input: "text",
      inputLabel: "Enter your Pincode",
      inputPlaceholder: "Eg: 673001",
      confirmButtonText: "Check",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Please enter pincode";
        if (!/^\d{6}$/.test(value)) return "Enter a valid 6-digit pincode";
      },
    });

    if (!pincode) return;

    try {
      const { data } = await axios.post(`${BASE_URL}/check-location`, {
        pincode,
      });

      if (data.available) {
        Swal.fire({
          icon: "success",
          title: "Service Available",
          text: "Great! EasyFix service is available in your area.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Sorry!",
          text: "EasyFix service is not available in your area.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center " to="/">
          <img src={logo} alt="EasyFix" width="150" />
          {/* <strong>EasyFix</strong> */}
        </Link>
        <button
          className="btn btn-outline-primary p-1"
          style={{ width: "32px", height: "32px", marginLeft: "5%" }}
          onClick={checkAvailability}
        >
          <FaMapMarkerAlt size={14} />
        </button>

        {/* Toggle */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarMenu"
        >
          <ul className="navbar-nav mx-auto gap-5">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/T&C">
                T&C
              </Link>
            </li>

             <div className="nav-buttons-inNav">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin" className="btn btn-outline-primary">
                  Admin Dashboard
                </Link>
              ) : user.role === "staff" ? (
                <Link to="/staff" className="btn btn-outline-primary">
                  Staff Dashboard
                </Link>
              ) : (
                <Link to="/user-profile" className="btn btn-outline-primary">
                  Profile
                </Link>
              )}

              <button className="btn btn-danger" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-outline-primary">
                Sign In
              </Link>

              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
          </ul>
        </div>
        {/* Buttons */}
        <div className="nav-buttons">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin" className="btn btn-outline-primary">
                  Admin Dashboard
                </Link>
              ) : user.role === "staff" ? (
                <Link to="/staff" className="btn btn-outline-primary">
                  Staff Dashboard
                </Link>
              ) : (
                <Link to="/user-profile" className="btn btn-outline-primary">
                  Profile
                </Link>
              )}

              <button className="btn btn-danger" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-outline-primary">
                Sign In
              </Link>

              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
