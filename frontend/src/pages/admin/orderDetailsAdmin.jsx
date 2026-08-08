import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./orderDetailsAdmin.css";

const OrderDetailsAdmin = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/order-details/${id}`, {
        withCredentials: true,
      });
      setWork(res.data.work);
      setOrder(res.data.order);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="order-details">
      <h2>Order Details</h2>

      <div className="card">
        <div className="service-row">
          <div className="service-card">
            <h3>Service</h3>
            <img
              src={order.service.image}
              alt={order.service.serviceName}
              className="service-image"
            />

            <div className="info">
              <p>
                <strong>Service :</strong> {order.service.servicename}
              </p>

              <p>
                <strong>Price :</strong> ₹{order.amount}
              </p>
            </div>
          </div>

          <div className="payment-card">
            {work?.bill ? (
              <>
                <h4 className="receipt-title">Payment Bill</h4>

                <div className="receipt">
                  <div className="receipt-row">
                    <span>Basic Cost</span>
                    <span>₹{work.bill?.basicAmount}</span>
                  </div>

                  <div className="receipt-row">
                    <span>Extra Hours</span>
                    <span>{work.bill?.extraHours ?? 0}</span>
                  </div>

                  <div className="receipt-row">
                    <span>Extra Charge</span>
                    <span>₹{(work.bill?.extraHours ?? 0) * 200}</span>
                  </div>

                  <div className="receipt-row">
                    <span>Additional Charge</span>
                    <span>₹{work.bill?.additionalCharges ?? 0}</span>
                  </div>

                  <div className="receipt-row">
                    <span>Remarks</span>
                    <span>{work.bill?.remarks || "-"}</span>
                  </div>

                  <hr />

                  <div className="receipt-row total">
                    <span>Total</span>
                    <span>₹{work.bill?.totalAmount}</span>
                  </div>

                  <hr />

                  <div className="receipt-row">
                    <span>Payment Status</span>
                    <span>{order.paymentStatus}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Order Status</span>
                    <span>{order.orderStatus}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h4 className="receipt-title">Payment</h4>

                <div className="no-bill">
                  <p>
                    <strong>Bill:</strong> Not Generated
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {order.paymentStatus}
                  </p>
                  <p>
                    <strong>Order Status:</strong> {order.orderStatus}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order */}

      <div className="card">
        <h3>Order Information</h3>

        <p>
          <strong>Order ID :</strong> {order._id}
        </p>

        <p>
          <strong>Preferred Date :</strong>{" "}
          {new Date(order.preferredDate).toLocaleDateString()}
        </p>
      </div>
      <div className="details-row">
        {/* Customer */}

        <div className="card">
          <h3>Customer Details</h3>

          <p>
            <strong>Username :</strong> {order.user.name}
          </p>

          <p>
            <strong>Customer :</strong> {order.customerName}
          </p>

          <p>
            <strong>Email :</strong> {order.email}
          </p>

          <p>
            <strong>Phone :</strong> {order.phone}
          </p>
        </div>

        {/* Address */}

        <div className="card">
          <h3>Address</h3>

          <p>{order.address}</p>

          <p>{order.district}</p>

          <p>{order.state}</p>

          <p>{order.pin}</p>
        </div>
      </div>
      {/* Location */}

      <div className="card" style={{ textAlign: "center" }}>
        <h3>Location</h3>

        <p>
          <strong>Latitude :</strong> {order.latitude}
        </p>

        <p>
          <strong>Longitude :</strong> {order.longitude}
        </p>

        <a
          href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          <button>View Location</button>
        </a>
      </div>

      <div className="card">
        <h3>Staff Assignment</h3>

        {order.staff ? (
          <>
            <p>
              <strong>Staff Name :</strong> {order.staff?.name}
            </p>
            <p>
              <strong>Phone :</strong> {order.staff?.phone}
            </p>
            <p>
              <strong>Schedule :</strong> {work?.shift}
            </p>
          </>
        ) : (
          <>
            <p>No staff assigned.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsAdmin;
