import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./userOrderDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserOrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [service, setService] = useState(null);
  const [staff, setStaff] = useState(null);
  const [work, setWork] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user-order-details/${id}`, {
        withCredentials: true,
      });

      setOrder(response.data.order);
      setService(response.data.service);
      setStaff(response.data.staff);
      setWork(response.data.work);
      setBill(response.data.bill);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="receipt-page">
      <div className="receipt-card">
        {/* Header */}

        <div className="receipt-header">
          <h1>EasyFix</h1>
          <h2>Service Receipt</h2>
          <p>Thank you for choosing EasyFix.</p>
        </div>

        {/* Status */}

        <div className="status-banner">
          <span className="paid-status">✓ PAYMENT SUCCESSFUL</span>
        </div>

        {/* Order Information */}

        <div className="receipt-section">
          <h3>Order Information</h3>

          <div className="receipt-row">
            <span>Order ID</span>
            <span>#{order._id.slice(-8).toUpperCase()}</span>
          </div>

          <div className="receipt-row">
            <span>Booking Date</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="receipt-row">
            <span>Service Date</span>
            <span>{new Date(order.preferredDate).toLocaleDateString()}</span>
          </div>

          <div className="receipt-row">
            <span>Payment Status</span>
            <span className="success">Paid</span>
          </div>

          <div className="receipt-row">
            <span>Order Status</span>
            <span>{order.orderStatus}</span>
          </div>
        </div>

        {/* Service */}

        <div className="receipt-section">
          <h3>Service Details</h3>

          <div className="receipt-row">
            <span>Service</span>
            <span>{service.servicename}</span>
          </div>

          <div className="receipt-row">
            <span>Assigned Staff</span>
            <span>{staff.name}</span>
          </div>

          <div className="receipt-row">
            <span>Time</span>
            <span>{work.shift}</span>
          </div>
        </div>

        {/* Customer */}

        <div className="receipt-section">
          <h3>Customer Details</h3>

          <div className="receipt-row">
            <span>Name</span>
            <span>{order.customerName}</span>
          </div>

          <div className="receipt-row">
            <span>Phone</span>
            <span>{order.phone}</span>
          </div>

          <div className="receipt-row">
            <span>Email</span>
            <span>{order.email}</span>
          </div>
        </div>

        {/* Address */}

        <div className="receipt-section">
          <h3>Service Address</h3>

          <p>{order.address}</p>
          <p>{order.district}</p>
          <p>{order.state}</p>
          <p>{order.pin}</p>
        </div>

        {/* Payment */}

        <div className="receipt-section">
          <h3>Payment Summary</h3>

          <div className="receipt-row">
            <span>Basic Charge</span>
            <span>₹{bill.basicAmount}</span>
          </div>

          <div className="receipt-row">
            <span>Extra Hours</span>
            <span>{bill.extraHours} hour</span>
          </div>

          <div className="receipt-row">
            <span>Extra Hours charge</span>
            <span>₹{bill.extraHours * 200}</span>
          </div>

          <div className="receipt-row">
            <span>Additional Charges</span>
            <span>₹{bill.additionalCharges}</span>
          </div>

          <hr />

          <div className="receipt-row total">
            <span>Total Paid</span>
            <span>₹{bill.totalAmount}</span>
          </div>
        </div>

        {/* Remarks */}

        <div className="receipt-section">
          <h3>Service Remarks</h3>

          <p>{bill.remarks || "No remarks added."}</p>
        </div>

        {/* Footer */}

        <div className="receipt-footer">
          <h3>Thank You!</h3>

          <p>We appreciate your trust in EasyFix.</p>

          <p>For any assistance, contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
