import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addStaff } from "../../redux/staffSlice";
import { useEffect, useState } from "react";

const AddStaff = () => {
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    place: "",
    dob: "",
    phone: "",
    gender: "",
    education: "",
    jobRole: "",
    experience: "",
    salary: "",

    photo: null,

    agreement: false,
    bankName: "",

    accountNumber: "",
    confirmAccountNumber: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
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

    agreement: Yup.boolean().oneOf([true], "Please accept the agreement"),
    bankName: Yup.string().required("Bank Name is required"),

    accountNumber: Yup.string().required("Account Number is required"),

    confirmAccountNumber: Yup.string()
      .oneOf([Yup.ref("accountNumber")], "Account numbers do not match")
      .required("Confirm Account Number is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
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

      formData.append("agreementAccepted", values.agreement);

      // Photo
      if (values.photo) {
        formData.append("photo", values.photo);
      }

      const response = await axios.post(
        `${BASE_URL}/admin/add-staff`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.staff) {
        dispatch(addStaff(response.data.staff));
      }

      await Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
      });

      resetForm();

      navigate("/admin/staff");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to add service",
        icon: "error",
      });
    }
  };

  return (
    <div
      style={{
        background: "#f4f6f9",
        minHeight: "100vh",
        padding: "40px",
        marginLeft: "15%",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Add Staff</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              {/* Login Details */}
              <h3>Login Details</h3>

              <div className="row">
                <div className="field">
                  <label>Name</label>
                  <Field name="name" />
                  <ErrorMessage name="name" component="small" />
                </div>

                <div className="field">
                  <label>Email</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component="small" />
                </div>

                <div className="field">
                  <label>Password</label>
                  <Field name="password" type="password" />
                  <ErrorMessage name="password" component="small" />
                </div>

                <div className="field">
                  <label>Confirm Password</label>
                  <Field name="confirmPassword" type="password" />
                  <ErrorMessage name="confirmPassword" component="small" />
                </div>
              </div>

              <hr />

              {/* Personal Details */}
              <h3>Personal Details</h3>

              <div className="row">
                <div className="field">
                  <label>Place</label>
                  <Field name="place" />
                  <ErrorMessage name="place" component="small" />
                </div>

                <div className="field">
                  <label>Date of Birth</label>
                  <Field name="dob" type="date" />
                  <ErrorMessage name="dob" component="small" />
                </div>

                <div className="field">
                  <label>Phone Number</label>
                  <Field
                    name="phone"
                    type="text"
                    placeholder="Enter Phone Number"
                  />
                  <ErrorMessage name="phone" component="small" />
                </div>

                <div className="field">
                  <label>Gender</label>
                  <Field as="select" name="gender">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Field>
                  <ErrorMessage name="gender" component="small" />
                </div>

                <div className="field">
                  <label>Education</label>
                  <Field name="education" />
                  <ErrorMessage name="education" component="small" />
                </div>

                <div className="field">
                  <label>Job Role</label>
                  <Field as="select" name="jobRole">
                    <option value="">Select Job Role</option>

                    {services.map((service) => (
                      <option key={service._id} value={service.servicename}>
                        {service.servicename}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="jobRole" component="small" />
                </div>

                <div className="field">
                  <label>Experience</label>
                  <Field
                    name="experience"
                    type="number"
                    placeholder="Example: 3 "
                  />
                  <ErrorMessage name="experience" component="small" />
                </div>

                <div className="field">
                  <label>Salary</label>
                  <Field
                    name="salary"
                    type="number"
                    placeholder="Basic salary"
                  />
                  <ErrorMessage name="salary" component="small" />
                </div>

                <div className="field">
                  <label>Photo</label>
                  <input
                    type="file"
                    accept="photo/*"
                    onChange={(e) =>
                      setFieldValue("photo", e.currentTarget.files[0])
                    }
                  />
                </div>
              </div>
              <hr />

              {/* Bank Details */}
              <h3>Bank Details</h3>

              <div className="row">
                <div className="field">
                  <label>Bank Name</label>
                  <Field
                    type="text"
                    name="bankName"
                    placeholder="Enter Bank Name"
                  />
                  <ErrorMessage name="bankName" component="small" />
                </div>

                <div className="field">
                  <label>Account Number</label>
                  <Field
                    type="text"
                    name="accountNumber"
                    placeholder="Enter Account Number"
                  />
                  <ErrorMessage name="accountNumber" component="small" />
                </div>

                <div className="field">
                  <label>Confirm Account Number</label>
                  <Field
                    type="text"
                    name="confirmAccountNumber"
                    placeholder="Re-enter Account Number"
                  />
                  <ErrorMessage name="confirmAccountNumber" component="small" />
                </div>
              </div>

              <hr />

              {/* Agreement */}
              <h3>Staff Agreement</h3>

              <div
                style={{
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  lineHeight: "1.7",
                }}
              >
                I hereby declare that all the information provided above is true
                and correct. I agree to follow all company rules, maintain
                customer satisfaction, protect company property, maintain
                confidentiality, complete assigned duties responsibly, and
                follow the probation period and employment terms decided by the
                company. Any violation of company policies may lead to
                disciplinary action or termination.
              </div>

              <label>
                <Field type="checkbox" name="agreement" /> I agree to the above
                terms and conditions.
              </label>
              <br />
              <ErrorMessage name="agreement" component="small" />

              <br />
              <br />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add Staff
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <style>{`
        .row{
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:20px;
        }

        .field{
            display:flex;
            flex-direction:column;
        }

        label{
            margin-bottom:5px;
            font-weight:600;
        }

        input,select{
            padding:10px;
            border:1px solid #ccc;
            border-radius:5px;
        }

        small{
            color:red;
            margin-top:4px;
        }

        hr{
            margin:30px 0;
        }

        @media(max-width:768px){
            .row{
                grid-template-columns:1fr;
            }
        }
      `}</style>
    </div>
  );
};

export default AddStaff;
