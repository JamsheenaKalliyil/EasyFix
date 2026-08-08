import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/urls";
import "./form.css";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },

    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .required("OTP is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/verify-otp`, {
          email,
          otp: values.otp,
        });

        await Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });

        navigate("/reset-password", {
          state: { email },
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Invalid OTP",
          icon: "error",
        });
      }
    },
  });

  const handleResend = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/send-otp`, {
        email,
      });

      setTimeLeft(60);

      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Unable to resend OTP",
        icon: "error",
      });
    }
  };

  return (
    <div className="form-wrap">
      <form onSubmit={formik.handleSubmit}>
        <h3 style={{ textAlign: "center" }}>Verify OTP</h3>

        <p>{email}</p>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formik.values.otp}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {formik.touched.otp && formik.errors.otp && (
          <p className="errors">{formik.errors.otp}</p>
        )}

        <p>
          Time Left: <strong>{timeLeft} sec</strong>
        </p>

        <button type="submit">Verify OTP</button>

        <button type="button" onClick={handleResend} disabled={timeLeft > 0}>
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
