import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from "../../utils/urls";
import "./resetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Confirm Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/reset-password`, {
          email,
          password: values.password,
        });

        await Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });

        navigate("/signin");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      }
    },
  });

  return (
    <div className="form-wrap">
      <form onSubmit={formik.handleSubmit}>
        <h3 style={{ textAlign: "center" }}>Reset Password</h3>

        <p style={{ textAlign: "center" }}>{email}</p>

        {/* Password */}
        <div className="password-box">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {formik.touched.password && formik.errors.password && (
          <p className="errors">{formik.errors.password}</p>
        )}

        {/* Confirm Password */}
        <div className="password-box">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <span
            className="eye-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="errors">{formik.errors.confirmPassword}</p>
        )}

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
