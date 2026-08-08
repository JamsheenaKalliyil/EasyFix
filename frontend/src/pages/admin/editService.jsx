// export default EditService;

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/urls";
import "./editService.css";

import { useEffect, useState } from "react";

const EditService = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/service-details/${id}`, {
          withCredentials: true,
        });

        setService(response.data.service);
      } catch (error) {
        console.log(error);
      }
    };

    fetchService();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      servicename: service?.servicename || "",
      description: service?.description || "",
      price: service?.price || "",
      duration: service?.duration || "",

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

      // Image is optional while editing
      image: Yup.mixed().nullable(),
    }),

    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append("servicename", values.servicename);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("duration", values.duration);

        if (values.image) {
          formData.append("image", values.image);
        }
        console.log("formdata:", formData);

        const response = await axios.put(
          `${BASE_URL}/admin/edit-service/${id}`,
          formData,
          {
            withCredentials: true,
          },
        );

        await Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });

        navigate("/admin/services");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Failed to update service",
          icon: "error",
        });
      }
    },
  });

  return (
    <div className="edit-service-page">
      <div className="edit-service-container">
        <h2>Edit Service</h2>

        <form onSubmit={formik.handleSubmit} className="edit-service-form">
          <div className="form-group">
            <label htmlFor="servicename">Service Name</label>
            <input
              type="text"
              id="servicename"
              name="servicename"
              value={formik.values.servicename}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.servicename && formik.errors.servicename && (
              <p className="errors">{formik.errors.servicename}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="errors">{formik.errors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.price && formik.errors.price && (
              <p className="errors">{formik.errors.price}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.duration && formik.errors.duration && (
              <p className="errors">{formik.errors.duration}</p>
            )}
          </div>

          {service && (
            <div className="form-group">
              <label>Current Image</label>
              <img
                src={service.image}
                alt={service.servicename}
                className="service-preview"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="image">Upload New Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) =>
                formik.setFieldValue("image", e.currentTarget.files[0])
              }
            />
          </div>

          <button
            type="submit"
            className="update-btn"
            onClick={() => console.log("button clicked")}
          >
            Update Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditService;
