import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BASE_URL } from "../../utils/urls";
import axios from "axios";
import "./servicesAdmin.css";
import { viewServices } from "../../redux/servicesSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ServicesAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { services } = useSelector((state) => state.service);
  const services = useSelector((state) => state.services.services);

  const getServices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/services`, {
        withCredentials: true,
      });

      dispatch(viewServices(response.data?.services));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleRemoveService = async (id) => {
    const result = await Swal.fire({
      title: "Remove Service?",
      text: "This service will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/remove-service/${id}`,
        {
          withCredentials: true,
        },
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
      });
       getServices()
      navigate("/admin/services");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h2>Services</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/admin/add-services")}
        >
          + Add New Service
        </button>
      </div>

      <div className="service-grid">
        {services?.map((service) => (
          <div className="service-card" key={service._id}>
            <img src={service.image} alt={service.serviceName} />
            {/* <img
              src={`${BASE_URL}/uploads/${service.image}`}
              alt={service.serviceName}
            /> */}

            <div className="service-content">
              <h3>{service.servicename?.toUpperCase()}</h3>
              <h4>₹{service.price}</h4>

              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/edit-service/${service._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleRemoveService(service._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesAdmin;
