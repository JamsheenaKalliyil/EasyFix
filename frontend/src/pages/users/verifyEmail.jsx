import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/urls";
import "./form.css";

const VerifyEmail = () => {
  const navigate = useNavigate();
  console.log("url", BASE_URL);
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/send-otp`, values);

        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        }).then(() => {
          navigate("/verify-otp", {
            state: {
              email: values.email,
            },
          });
        });
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to send OTP",
          icon: "error",
        });
      }
    },

    
  });

  return (
    <div className="form-wrap">
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {formik.touched.email && formik.errors.email && (
          <p className="errors">{formik.errors.email}</p>
        )}

        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
