import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils/urls";
import "./payNow.css";

const PayNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get-bill/${id}`, {
        withCredentials: true,
      });

      setBill(res.data.bill);
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Unable to load bill", "error");
    }
  };

  const handlePayment = async () => {
    try {
      // Step 10: Get Razorpay Order from backend
      const response = await axios.post(
        `${BASE_URL}/create-payment`,
        { orderId: bill.order },
        { withCredentials: true },
      );

      const { razorpayOrder, key } = response.data;

      // Step 11: Create Razorpay options
      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "EasyFix",
        description: "Service Payment",

        handler: async function (response) {
          // Send payment details to backend for verification
          try {
            const verify = await axios.post(
              `${BASE_URL}/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: bill.order,
              },
              {
                withCredentials: true,
              },
            );

            if (verify.data.success) {
              await fetchBill();
              Swal.fire({
                icon: "success",
                title: "Payment Successful",
                text: "Your payment has been completed successfully.",
              });

              // fetchBill(); or navigate("/my-orders");
            } else {
              Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: verify.data.message || "Payment verification failed.",
              });
            }
          } catch (error) {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: "Something went wrong while verifying the payment.",
            });
          }
        },
      };

      // Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `${BASE_URL}/review/${id}`,
        {
          rating,
          review,
        },
        {
          withCredentials: true,
        },
      );

      Swal.fire("Success", "Review Submitted", "success");

      // setRating(0);
      // setReview("");
      navigate("/user-orders");
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (!bill) return <h2>Loading...</h2>;

  return (
    <div className="payment-page">
      <div className="bill-card">
        <h2 style={{ textAlign: "center" }}>Payment & Review</h2>

        <div className="bill-row">
          <span>Service : </span>
          <strong>{bill.service?.servicename}</strong>
        </div>

        <div className="bill-row">
          <span>Staff : </span>
          <strong>{bill.staff?.name}</strong>
        </div>

        <div className="bill-row">
          <span>Base Amount : </span>
          <strong>₹{bill.basicAmount}</strong>
        </div>

        <div className="bill-row">
          <span>Extra Hours : </span>
          <strong>{bill.extraHours ?? 0}</strong>
        </div>

        <div className="bill-row">
          <span>Extra Charge : </span>
          <strong>₹{Number(bill.extraHours ?? 0) * 200}</strong>
        </div>

        <div className="bill-row">
          <span>Additional Charge : </span>
          <strong>₹{bill.additionalCharges ?? 0}</strong>
        </div>

        <hr />

        <div className="bill-row total">
          <span>Total : </span>
          <strong>₹{bill.totalAmount ?? 0}</strong>
        </div>

        {bill.paymentStatus !== "Paid" && (
          <button className="pay-btn" onClick={handlePayment}>
            Pay Now
          </button>
        )}
      </div>

      {bill.paymentStatus === "Paid" && (
        <div className="review-card">
          <h3>Rate Our Service</h3>

        

          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => {
                  if (rating === star) {
                    setRating(star - 1);
                  } else {
                    setRating(star);
                  }
                }}
                style={{ cursor: "pointer", fontSize: "30px" }}
              >
                {star <= rating ? "⭐" : "☆"}
              </span>
            ))}
          </div>

          <textarea
            rows="5"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          <button className="submit-btn" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
};

export default PayNow;
