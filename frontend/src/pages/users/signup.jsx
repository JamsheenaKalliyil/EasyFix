import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../redux/authSlice";
import "./signup.css";
import { BASE_URL } from "../../utils/urls";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",

      email: "",
      password: "",
      cpassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[A-Za-z ]+$/, "Only letters allowed")
        .required("Name required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),

      cpassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        // if (user) {
        //   Swal.fire({
        //     title: "Already logged in",
        //     text: "User is already logged in.",
        //     icon: "error",
        //   });
        //   return;
        // }

        const response = await axios.post(`${BASE_URL}/signup`, values);

        dispatch(signUp(response.data.user));

        formik.resetForm();

        Swal.fire({
          title: "Success",
          text: "Signup Successful",
          icon: "success",
          confirmButtonText: "Go To Sign In",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/signin");
          }
        });
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Signup Failed",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      }
    },
  });
  return (
    <div className="signup-container">
      <div className="signup-card">
        <form onSubmit={formik.handleSubmit} className="signup-form">
          <h2 className="signup-title">SIGN UP</h2>

          {/* Name */}
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="signup-error">{formik.errors.name}</p>
          )}

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="signup-error">{formik.errors.email}</p>
          )}

          {/* Password */}
          <label htmlFor="password">Password</label>
          <div className="signup-password-box">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className="signup-eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="signup-error">{formik.errors.password}</p>
          )}

          {/* Confirm Password */}
          <label htmlFor="cpassword">Confirm Password</label>
          <div className="signup-password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="cpassword"
              placeholder="Confirm password"
              name="cpassword"
              value={formik.values.cpassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <span
              className="signup-eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {formik.touched.cpassword && formik.errors.cpassword && (
            <p className="signup-error">{formik.errors.cpassword}</p>
          )}

          <button type="submit" className="signup-btn">
            Sign Up
          </button>

          <p className="signup-links">
            Already have an account?{" "}
            <Link to="/signin" className="signup-link">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Signup;
