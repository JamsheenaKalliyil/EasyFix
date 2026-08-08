import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { FaStar } from "react-icons/fa";
import "./staffReviews.css";
const StaffReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/staff/staff-reviews`, {
        withCredentials: true,
      });
      setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="staff-reviews">
      <h2>Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div className="review-row" key={review._id}>
            <div className="top">
              <h4>{review.user?.name}</h4>
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="service">{review.service?.servicename}</p>

            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= review.rating ? "#ffc107" : "#ddd"}
                />
              ))}
            </div>

            <p className="comment">{review.review}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default StaffReviews;
