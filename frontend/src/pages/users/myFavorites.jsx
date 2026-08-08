import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/urls";
import { viewFavorite, removeFavorite } from "../../redux/favSlice";
import "./myFavorites.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MyFavorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorite } = useSelector((state) => state.favorite);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/favorites`, {
        withCredentials: true,
      });

      dispatch(viewFavorite(res.data.favorites));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (serviceId) => {
    const result = await Swal.fire({
      title: "Remove Favorite?",
      text: "Are you sure you want to remove this service from your favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post(
        `${BASE_URL}/toggle-favorite/${serviceId}`,
        {},
        { withCredentials: true },
      );

      dispatch(removeFavorite(serviceId));
      fetchFavorites();

      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Service removed from favorites.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove favorite.",
      });
    }
  };

  return (
    <div className="favorites-container">
      <h2>My Favorites</h2>

      {favorite.length === 0 ? (
        <p>No favorite services.</p>
      ) : (
        <div className="favorites-grid">
          {favorite.map((fav) => (
            <div className="favorite-card" key={fav._id}>
              <img
                src={fav.service.image}
                alt={fav.service.servicename}
                className="favorite-image"
              />

              <h3>{fav.service.servicename}</h3>

              <p>₹ {fav.service.price}</p>

              <div className="favorite-buttons">
                <button
                  className="book-btn"
                  onClick={() => navigate(`/order-now/${fav.service._id}`)}
                >
                  Book Now
                </button>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(fav.service._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
