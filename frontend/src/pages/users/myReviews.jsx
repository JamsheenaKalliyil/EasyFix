import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./myReviews.css";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/my-reviews`, {
        withCredentials: true,
      });

      setReviews(res.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="myreview-container">
      <h2 className="myreview-title">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="myreview-empty">No reviews yet.</p>
      ) : (
        <div className="myreview-list">
          {[...reviews].reverse().map((item) => (
            <div className="myreview-card" key={item._id}>
              <div className="myreview-header">
                <img
                  src={item.service.image}
                  alt={item.service.servicename}
                  className="myreview-image"
                />

                <div className="myreview-service">
                  <h3>{item.service.servicename}</h3>

                  <div className="myreview-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= item.rating
                            ? "myreview-star filled"
                            : "myreview-star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <span className="myreview-date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="myreview-text">{item.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
