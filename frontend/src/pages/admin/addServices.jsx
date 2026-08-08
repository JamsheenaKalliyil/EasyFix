import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/urls";
import "./addservices.css";
import { addServices } from "../../redux/servicesSlice";

const AddServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      servicename: "",
      description: "",
      price: "",
      duration: "",

      image: null,
    },

    validationSchema: Yup.object({
      servicename: Yup.string().required("Service name is required"),

      description: Yup.string()
        .min(10, "Description should contain at least 10 characters")
        .required("Description is required"),

      price: Yup.number()
        .typeError("Price must be a number")
        .min(0, "Price cannot be negative")
        .required("Price is required"),

      duration: Yup.string().required("Duration is required"),

      image: Yup.mixed().required("Please select an image"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();

        formData.append("servicename", values.servicename);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("duration", values.duration);
        formData.append("isAvailable", values.isAvailable);
        formData.append("image", values.image);
        formData.append("availablePins", values.availablePins);

        const response = await axios.post(
          `${BASE_URL}/admin/add-services`,
          formData,
          {withCredentials:true}
        );

        // Optional: update redux if backend returns all services
        if (response.data.service) {
          dispatch(addServices(response.data.service));
        }

        await Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });

        resetForm();

        navigate("/admin/services");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to add service",
          icon: "error",
        });
      }
    },
  });

  return (
    <div className="adminAddServicePage">
      <div className="adminAddServiceContainer">
        <form className="adminAddServiceForm" onSubmit={formik.handleSubmit}>
          <h2 className="adminAddServiceTitle">Add New Service</h2>

          <input
            className="adminAddServiceInput"
            type="text"
            name="servicename"
            placeholder="Service Name"
            value={formik.values.servicename}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.servicename && formik.errors.servicename && (
            <p className="adminAddServiceError">{formik.errors.servicename}</p>
          )}

          <textarea
            className="adminAddServiceTextarea"
            name="description"
            rows="4"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.description && formik.errors.description && (
            <p className="adminAddServiceError">{formik.errors.description}</p>
          )}

          <input
            className="adminAddServiceInput"
            type="number"
            name="price"
            placeholder="Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.price && formik.errors.price && (
            <p className="adminAddServiceError">{formik.errors.price}</p>
          )}

          <input
            className="adminAddServiceInput"
            type="text"
            name="duration"
            placeholder="Duration (Example: 1 Hour)"
            value={formik.values.duration}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.duration && formik.errors.duration && (
            <p className="adminAddServiceError">{formik.errors.duration}</p>
          )}

          <input
            className="adminAddServiceFile"
            type="file"
            accept="image/*"
            onChange={(event) =>
              formik.setFieldValue("image", event.currentTarget.files[0])
            }
          />

          {formik.errors.image && (
            <p className="adminAddServiceError">{formik.errors.image}</p>
          )}

          <button className="adminAddServiceButton" type="submit">
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServices;
