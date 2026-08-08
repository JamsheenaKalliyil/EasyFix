import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { useNavigate, useParams } from "react-router-dom";
import "./editStaff.css";
import { Form, Field, ErrorMessage } from "formik";
const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [staff, setStaff] = useState({});
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/staff-details/${id}`,
          {
            withCredentials: true,
          },
        );

        setStaff(response.data.staff);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, [id]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/services`, {
          withCredentials: true,
        });

        setServices(response.data.services);
      } catch (error) {
        console.log(error);
      }
    };

    fetchServices();
  }, []);

  const initialValues = {
    name: staff?.name || "",
    email: staff?.user?.email || "",
    place: staff?.place || "",
    dob: staff?.dob ? staff.dob.split("T")[0] : "",
    phone: staff?.phone || "",
    gender: staff?.gender || "",
    education: staff?.education || "",
    jobRole: staff?.jobRole || "",
    experience: staff?.experience || "",
    salary: staff?.salary || "",
    bankName: staff?.bankName || "",
    accountNumber: staff?.accountNumber || "",
    confirmAccountNumber: staff?.accountNumber || "",
    photo: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    place: Yup.string().required("Place is required"),

    dob: Yup.date().required("Date of Birth is required"),

    phone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid phone number")
      .required("Phone number is required"),

    gender: Yup.string().required("Gender is required"),

    education: Yup.string().required("Education is required"),

    jobRole: Yup.string().required("Job Role is required"),

    experience: Yup.number().required("Experience is required"),

    salary: Yup.number().required("Salary is required"),

    bankName: Yup.string().required("Bank Name is required"),

    accountNumber: Yup.string().required("Account Number is required"),

    confirmAccountNumber: Yup.string()
      .oneOf([Yup.ref("accountNumber")], "Account numbers do not match")
      .required("Confirm Account Number is required"),

    photo: Yup.mixed().nullable(),
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("place", values.place);
      formData.append("dob", values.dob);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("education", values.education);
      formData.append("jobRole", values.jobRole);
      formData.append("experience", values.experience);
      formData.append("salary", values.salary);
      formData.append("bankName", values.bankName);
      formData.append("accountNumber", values.accountNumber);

      if (values.photo) {
        formData.append("photo", values.photo);
      }

      const response = await axios.put(
        `${BASE_URL}/admin/edit-staff/${id}`,
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

      navigate("/admin/staff");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to update staff",
        icon: "error",
      });
    }
  };
  return (
    <div className="edit-staff-page">
      <div className="edit-staff-container">
        <h2>Edit Staff</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form className="edit-staff-form">
              <div className="edit-staff-group">
                <label>Name</label>
                <Field type="text" name="name" />
                <ErrorMessage
                  name="name"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Email</label>
                <Field type="email" name="email" />
                <ErrorMessage
                  name="email"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Place</label>
                <Field type="text" name="place" />
                <ErrorMessage
                  name="place"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Date of Birth</label>
                <Field type="date" name="dob" />
                <ErrorMessage
                  name="dob"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Phone</label>
                <Field type="text" name="phone" />
                <ErrorMessage
                  name="phone"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Gender</label>
                <Field as="select" name="gender">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Education</label>
                <Field type="text" name="education" />
                <ErrorMessage
                  name="education"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Job Role</label>
                <Field as="select" name="jobRole">
                  <option value="">Select Job Role</option>

                  {services.map((service) => (
                    <option key={service._id} value={service.servicename}>
                      {service.servicename}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="jobRole"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Experience</label>
                <Field type="number" name="experience" />
                <ErrorMessage
                  name="experience"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Salary</label>
                <Field type="number" name="salary" />
                <ErrorMessage
                  name="salary"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Bank Name</label>
                <Field type="text" name="bankName" />
                <ErrorMessage
                  name="bankName"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Account Number</label>
                <Field type="text" name="accountNumber" />
                <ErrorMessage
                  name="accountNumber"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              <div className="edit-staff-group">
                <label>Confirm Account Number</label>
                <Field type="text" name="confirmAccountNumber" />
                <ErrorMessage
                  name="confirmAccountNumber"
                  component="small"
                  className="edit-staff-error"
                />
              </div>

              {staff.photo && (
                <div className="edit-staff-group">
                  <label>Current Photo</label>
                  <img
                    src={staff.photo}
                    alt={staff.name}
                    className="edit-staff-preview"
                  />
                </div>
              )}

              <div className="edit-staff-group">
                <label>Upload New Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFieldValue("photo", e.currentTarget.files[0])
                  }
                />
              </div>

              <button type="submit" className="edit-staff-btn">
                Update Staff
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditStaff;
