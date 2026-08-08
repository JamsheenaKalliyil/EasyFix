import { useFormik } from "formik";
import * as Yup from "yup";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./orderNow.css";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { addOrder } from "../../redux/orderSlice";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
const OrderNow = () => {
  const { id } = useParams();
  const [addresses, setAddresses] = useState([]);

  // const services = useSelector((state) => state.services.services);
  const [services, setServices] = useState([]);

  const service = services.find((service) => service._id === id);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/services`);

        setServices(res.data.services);
      } catch (err) {
        console.log(err);
      }
    };

    fetchServices();
  }, []);
  const formik = useFormik({
    initialValues: {
      service: service?._id || "",
      customerName: "",
      email: "",
      phone: "",
      address: "",
      district: "",
      state: "",
      pin: "",
      date: "",
      latitude: "",
      longitude: "",
    },

    validationSchema: Yup.object({
      customerName: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Enter a valid phone number")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      district: Yup.string().required("District is required"),
      state: Yup.string().required("State is required"),
      pin: Yup.string()
        .matches(/^\d{6}$/, "PIN must be 6 digits")
        .required("PIN is required"),
      date: Yup.date().required("Date is required"),
      service: Yup.string().required("Service is required"),
      latitude: Yup.string().required("Please share your location"),
      longitude: Yup.string().required("Please share your location"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${BASE_URL}/book-service`, values, {
          withCredentials: true,
        });

        dispatch(addOrder(response.data.order));

        formik.resetForm();

        Swal.fire({
          title: "Success",
          text: "Order Successful",
          icon: "success",
          confirmButtonText: "Go to service",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/services");
          }
        });
      } catch (error) {
        console.log(error);

        Swal.fire({
          title: "Order canot place",
          text: error.response?.data?.message || "Something went wrong",
          icon: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (service) {
      formik.setFieldValue("service", service._id);
    }
  }, [service]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user-address`, {
          withCredentials: true,
        });

        setAddresses(res.data.addresses);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddresses();
  }, []);

  const handleAddressSelect = (addressId) => {
    const selected = addresses.find((item) => item._id === addressId);

    if (!selected) return;

    formik.setValues({
      ...formik.values,
      customerName: selected.customerName,
      email: selected.email,
      phone: selected.phone,
      address: selected.address,
      district: selected.district,
      state: selected.state,
      pin: selected.pin,
    });
  };
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        formik.setFieldValue("latitude", position.coords.latitude);
        formik.setFieldValue("longitude", position.coords.longitude);

        alert("Location shared successfully!");
      },
      (error) => {
        alert(error.message);
      },
    );
  };

  if (!service) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="ordernow-page">
      <form className="ordernow-form" onSubmit={formik.handleSubmit}>
        <div className="ordernow-service-info">
          <img
            src={service.image}
            alt={service.servicename}
            className="ordernow-service-image"
          />

          <div className="ordernow-service-content">
            <h2>{service.servicename}</h2>
            <p>₹ {service.price}/hr</p>
          </div>
        </div>

        <div className="ordernow-address-section">
          <div className="ordernow-address-header">
            <h3>Saved Addresses</h3>
            <p>Select one of your saved addresses</p>
          </div>

          {addresses.length > 0 ? (
            <div className="ordernow-address-grid">
              {addresses.map((item) => (
                <label key={item._id} className="ordernow-address-card">
                  <input
                    type="radio"
                    name="savedAddress"
                    className="ordernow-address-radio"
                    onChange={() => handleAddressSelect(item._id)}
                  />

                  <div className="ordernow-address-details">
                    <div className="ordernow-address-top">
                      <h4>{item.customerName}</h4>
                      <span>{item.phone}</span>
                    </div>

                    <p className="ordernow-address-text">{item.address}</p>

                    <div className="ordernow-address-bottom">
                      <span>{item.district}</span>
                      <span>{item.state}</span>
                      <span>{item.pin}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="ordernow-no-address">No saved addresses found.</div>
          )}
        </div>
        <h3> Where Should We Provide the Service?</h3>
        <label>Customer Name</label>
        <input
          type="text"
          name="customerName"
          className="ordernow-input"
          placeholder="Enter your name"
          value={formik.values.customerName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.customerName && formik.errors.customerName && (
          <small className="ordernow-error">{formik.errors.customerName}</small>
        )}

        <label>Email</label>
        <input
          type="email"
          name="email"
          className="ordernow-input"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <small className="ordernow-error">{formik.errors.email}</small>
        )}

        <label>Phone Number</label>
        <input
          type="text"
          name="phone"
          className="ordernow-input"
          placeholder="Enter your phone number"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.phone && formik.errors.phone && (
          <small className="ordernow-error">{formik.errors.phone}</small>
        )}

        <label>Address</label>
        <textarea
          rows="4"
          name="address"
          className="ordernow-input"
          placeholder="Enter your address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.address && formik.errors.address && (
          <small className="ordernow-error">{formik.errors.address}</small>
        )}

        <div className="ordernow-row">
          <div className="ordernow-column">
            <label>District</label>
            <input
              type="text"
              name="district"
              className="ordernow-input"
              value={formik.values.district}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.district && formik.errors.district && (
              <small className="ordernow-error">{formik.errors.district}</small>
            )}
          </div>

          <div className="ordernow-column">
            <label>State</label>
            <input
              type="text"
              name="state"
              className="ordernow-input"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.state && formik.errors.state && (
              <small className="ordernow-error">{formik.errors.state}</small>
            )}
          </div>
        </div>

        <label>PIN Code</label>
        <input
          type="text"
          name="pin"
          className="ordernow-input"
          value={formik.values.pin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.pin && formik.errors.pin && (
          <small className="ordernow-error">{formik.errors.pin}</small>
        )}

        <label>Date</label>
        <input
          type="date"
          name="date"
          min={new Date().toISOString().split("T")[0]}
          className="ordernow-input"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.date && formik.errors.date && (
          <small className="ordernow-error">{formik.errors.date}</small>
        )}

        <input
          type="hidden"
          name="service"
          value={formik.values.service}
          onChange={formik.handleChange}
        />

        <label>Service</label>
        <input
          type="text"
          name="serviceName"
          value={service?.servicename || ""}
          readOnly
          className="ordernow-input"
        />

        <button
          type="button"
          className="ordernow-location-btn"
          onClick={getLocation}
        >
          <FaMapMarkerAlt />
          <span>Share Current Location</span>
        </button>

        <button type="submit" className="ordernow-submit-btn">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderNow;
