import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../redux/authSlice";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./signin.css";
import { BASE_URL } from "../../utils/urls";
import axios from "axios";
import { useState } from "react";
const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // const registeredUser = useSelector((state) => state.auth.user);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),

      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/signin`, values, {
          withCredentials: true,
        });

        dispatch(signIn(response.data));
        const role = response.data.user?.role;
        // localStorage.setItem("role", role);

        Swal.fire({
          title: "Success",
          text: "Login Successful",
          icon: "success",
        }).then(() => {
          if (role == "user") {
            navigate("/");
          } else if (role == "admin") {
            navigate("/admin");
          } else if (role == "staff") {
            navigate("/staff");
          }
        });
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: "Login Failed",
          text: error.response?.data?.message || "Invalid email or password",
          icon: "error",
        });
        return;
      }
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-card">
        <form onSubmit={formik.handleSubmit} className="signin-form">
          <h2 className="signin-title">SIGN IN</h2>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.email && formik.errors.email && (
            <p className="signin-error">{formik.errors.email}</p>
          )}

          <label htmlFor="password">Password</label>

          <div className="signin-password-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <span
              className="signin-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {formik.touched.password && formik.errors.password && (
            <p className="signin-error">{formik.errors.password}</p>
          )}

          <button type="submit" className="signin-btn">
            Sign In
          </button>

          <div className="signin-links">
            <p>
              <Link to="/verify-email">Forgot Password?</Link>
            </p>

            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="signup-link">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
