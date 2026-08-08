import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "./addAddress.css";
import { BASE_URL } from "../../utils/urls";
const AddAddress = () => {
  const navigate = useNavigate();

  const initialValues = {
    customerName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    state: "",
    pin: "",
  };

  const validationSchema = Yup.object({
    customerName: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    district: Yup.string().required("District is required"),
    state: Yup.string().required("State is required"),
    pin: Yup.string()
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode")
      .required("Pincode is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/add-address`, values, {
          withCredentials: true,
        });
     

      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message,
      });

      resetForm();
      navigate("/user-address");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Add New Address</h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <Field name="customerName" className="form-control" />
                  <ErrorMessage
                    name="customerName"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <Field name="phone" className="form-control" />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <Field
                    as="textarea"
                    rows="3"
                    name="address"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">District</label>
                    <Field name="district" className="form-control" />
                    <ErrorMessage
                      name="district"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <Field name="state" className="form-control" />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Pincode</label>
                    <Field name="pin" className="form-control" />
                    <ErrorMessage
                      name="pin"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  Save Address
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
