import "./services.css";
import { useDispatch, useSelector } from "react-redux";
import { viewServices } from "../../redux/servicesSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/urls";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addFavorite,
  removeFavorite,
  viewFavorite,
} from "../../redux/favSlice";
const Services = () => {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { services } = useSelector((state) => state.services);
  const [services,setServices]=useState([])
  const { favorite } = useSelector((state) => state.favorite);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/services`);
    setServices(res.data.services)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFavorite = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/favorites`, {
        withCredentials: true,
      });
      console.log("favorite", res.data.favorites);
      dispatch(viewFavorite(res.data.favorites));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async (serviceId) => {
    try {
      console.log("Service ID:", serviceId);

      const favRes = await axios.post(
        `${BASE_URL}/toggle-favorite/${serviceId}`,
        {},
        { withCredentials: true },
      );
      if (favRes.data.status === "added") {
        dispatch(addFavorite(favRes.data.favorite));
      } else {
        dispatch(removeFavorite(serviceId));
      }
      fetchServices(); // Refresh services
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchFavorite();
  }, []);

  const filteredServices = services?.filter((service) =>
    service.servicename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="s3-container">
      <div className="s3-search">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="s3-search-input"
        />
      </div>

      <h2 className="s3-title">Our Services</h2>

      <div className="s3-grid">
        {filteredServices?.map((service) => (
          <div className="s3-card" key={service._id}>
            <div className="s3-image-box">
              <img
                src={service.image}
                alt={service.servicename}
                className="s3-image"
              />


              <button
                className="s3-favorite-btn"
                onClick={() => handleFavorite(service._id)}
              >
                {favorite.some(
                  (fav) => String(fav.service?._id) === String(service._id),
                ) ? (
                  <span style={{ color: "red", fontSize: "24px" }}>♥</span>
                ) : (
                  <span style={{ color: "#777", fontSize: "24px" }}>♡</span>
                )}
              </button>
            </div>

            <div className="s3-content">
              <h3 className="s3-service-name">{service.servicename}</h3>

              <p className="s3-price">₹ {service.price}</p>

              <div className="s3-buttons">
                <button
                  className="s3-book-btn"
                  onClick={() => navigate(`/order-now/${service._id}`)}
                >
                  Book Now
                </button>

                <button
                  className="s3-details-btn"
                  onClick={() => navigate(`/service-details/${service._id}`)}
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
