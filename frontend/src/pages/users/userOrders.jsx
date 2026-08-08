import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./userOrders.css";
import { useDispatch, useSelector } from "react-redux";
import { viewOrders } from "../../redux/orderSlice";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const UserOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.userOrders);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/view-orders`, {
        withCredentials: true,
      });
      console.log("orders", res.data?.orders);
      dispatch(viewOrders(res.data.orders));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "No",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.patch(
        `${BASE_URL}/cancel-order/${orderId}`,
        {},
        { withCredentials: true },
      );

      Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // const handlePay = (orderId) => {
  //   navigate(`/pay-now/${orderId}`);
  // };

  const handleRetry = async (orderId) => {
    const result = await Swal.fire({
      title: "Retry Booking?",
      text: "A new booking will be created with the same details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Retry",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/retry-order/${orderId}`,
        {},
        { withCredentials: true },
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchOrders();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Retry Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="userOrder-page">
      <h4
        className="userOrder-title"
        style={{ paddingLeft: "30%", marginBottom: "8%" }}
      >
        My Orders
      </h4>

      {orders.length === 0 ? (
        <div className="userOrder-empty">
          <h3>No Orders Found</h3>
          <p>You haven't booked any services yet.</p>
        </div>
      ) : (
        <div className="userOrder-container">
          {orders.map((order) => (
            <div className="userOrder-card" key={order._id}>
              <img
                src={order.service?.image}
                alt={order.service?.servicename}
                className="userOrder-image"
              />

              <div className="userOrder-details">
                <h3 className="userOrder-service-name">
                  {order.service?.servicename}
                </h3>

                <p className="userOrder-text">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p className="userOrder-text">
                  <strong>Service Date:</strong>{" "}
                  {new Date(order.preferredDate).toLocaleDateString()}
                </p>

                <p className="userOrder-text">
                  <strong>Address:</strong> {order.address}
                </p>

                <p className="userOrder-text">
                  <strong>Cost:</strong> ₹{order.service?.price}/hr
                </p>

                <div className="userOrder-status-wrapper">
                  <span
                    className={`userOrder-status ${order.orderStatus?.toLowerCase()}`}
                  >
                    Order: {order.orderStatus}
                  </span>

                  <br />

                  <span
                    className={`userOrder-payment-status ${order.paymentStatus?.toLowerCase()}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>

                <div className="userOrder-actions">
                  {order.orderStatus === "Pending" && (
                    <button
                      className="userOrder-cancel-btn"
                      onClick={() => handleCancel(order._id)}
                    >
                      Cancel
                    </button>
                  )}

                  {order.orderStatus === "Completed" && (
                    <>
                      {order.paymentStatus === "Pending" ? (
                        <Link to={`/pay-now/${order._id}`}>
                          <button className="userOrder-paynow-btn">
                            Pay Now
                          </button>
                        </Link>
                      ) : (
                        <Link to={`/user-order-details/${order._id}`}>
                          <button className="userOrder-invoice-btn">
                            Receipt
                          </button>
                        </Link>
                      )}
                    </>
                  )}

                  {order.orderStatus === "Cancelled" && (
                    <button
                      className="userOrder-retry-btn"
                      onClick={() => handleRetry(order._id)}
                    >
                      Retry Booking
                    </button>
                  )}

                  {order.orderStatus === "Assigned" && (
                    <div className="userOrder-assigned-info">
                      <p>
                        Your service is scheduled for{" "}
                        <strong>
                          {new Date(order.preferredDate).toLocaleDateString()}
                        </strong>
                        . Please be available at the service location.
                      </p>

                      <p>
                        <strong>Staff:</strong> {order.staff?.name}
                      </p>

                      <p>
                        <strong>Contact:</strong> {order.staff?.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
