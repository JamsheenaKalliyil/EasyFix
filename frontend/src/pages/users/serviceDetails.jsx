import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import styles from "./serviceDetails.module.css";


import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../redux/favSlice";
import Swal from "sweetalert2";
const ServiceDetails = () => {
  const { favorite } = useSelector((state) => state.favorite);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [moreServices, setMoreServices] = useState([]);

  const fetchService = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/service-details/${id}`);

      setService(res.data.service);
      setReviews(res.data.reviews);
      setMoreServices(res.data.moreServices);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchService();
  }, [id]);

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
      fetchService(); // Refresh services
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (!service) return <h2>Loading...</h2>;

  return (
    <div className={styles.serviceDetailsContainer}>
      {/* Service Details */}
      <div className={styles.serviceCard}>
        <img
          src={service.image}
          alt={service.servicename}
          className={styles.serviceImage}
        />

        <div className={styles.serviceInfo}>
          <h1>{service.servicename}</h1>
          <h2>₹{service.price}</h2>
          <p>
            <strong>Duration :</strong> {service.duration}
          </p>

          <button
            className={styles.bookBtn}
            onClick={() => navigate(`/order-now/${service._id}`)}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* About */}
      <section className={styles.detailsSection}>
        <h2>About the Service</h2>

        <p>{service.description}</p>
      </section>

      {/* How it works */}

      <section className={styles.detailsSection}>
        <h2>How It Works</h2>

        <ol>
          <li>Choose your preferred date.</li>
          <li>Book the service.</li>
          <li>Professional staff will be assigned.</li>
          <li>Staff reaches your location.</li>
          <li>Service gets completed.</li>
          <li>Bill is generated.</li>
          <li>Make payment.</li>
          <li>Rate and review the service.</li>
        </ol>
      </section>

      {/* Terms */}

      <section className={styles.detailsSection}>
        <h2>Terms & Conditions</h2>

        <ul>
          <li>Customer should be available during service.</li>

          <li>Additional work may have additional charges.</li>

          <li>Cancellation after staff arrival may incur charges.</li>

          <li>Payment should be completed after bill generation.</li>
        </ul>
      </section>

      {/* Reviews */}

      <section className={styles.detailsSection}>
        <h2>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((item) => (
            <div key={item._id} className={styles.reviewCard}>
              <h4>{item.customerName}</h4>

              <p>{"⭐".repeat(item.rating)}</p>

              <p>{item.review}</p>
            </div>
          ))
        )}
      </section>

      {/* More services */}

      <section className={styles.detailsSection}>
        <h2>Explore More Services</h2>

        <div className={styles.moreSections}>
          {moreServices.map((service) => (
            <div key={service._id} className={styles.serviceBox}>
              <div className={styles.imageContainer}>
                <img src={service.image} alt={service.servicename} />
               

                <button
                  className={styles.favoriteButton}
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

              <h4>{service.servicename}</h4>

              <p>₹{service.price}</p>

              <div className={styles.serviceButton}>
                <button
                  className={styles.orderBtn}
                  onClick={() => navigate(`/order-now/${service._id}`)}
                >
                  Book Now
                </button>

                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/service-details/${service._id}`)}
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;
