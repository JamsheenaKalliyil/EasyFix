import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils/urls";
import "./orderDetailsStaff.css";

const OrderDetailsStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchWork = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/staff/order-details-staff/${id}`,
        {
          withCredentials: true,
        },
      );

      setWork(res.data.work);
      setStatus(res.data.work.status);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWork();
  }, []);

  const updateStatus = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/staff/update-order-status/${id}`,
        { status },
        { withCredentials: true },
      );

      setWork(res.data.work);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Work status updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="staff-order-details">
      <h2>Work Details</h2>

      {/* Service */}

      <div className="card">
        <h3>Service</h3>

        <p>
          <strong>Service :</strong> {work.service.servicename}
        </p>

        <p>
          <strong>Amount :</strong> ₹{work.order?.amount}/hr
        </p>

        <p>
          <strong>Date :</strong> {new Date(work.date).toLocaleDateString()}
        </p>

        <p>
          <strong>Shift :</strong> {work.shift}
        </p>
      </div>

      {/* Customer */}

      <div className="card">
        <h3>Customer Details</h3>

        <p>
          <strong>Name :</strong> {work.order?.customerName}
        </p>

        <p>
          <strong>Phone :</strong> {work.order?.phone}
        </p>

        <p>
          <strong>Email :</strong> {work.order?.email}
        </p>
      </div>

      {/* Address */}

      <div className="card">
        <h3>Address</h3>

        <p>{work.order?.address}</p>
        <p>{work.order?.district}</p>
        <p>{work.order?.state}</p>
        <p>{work.order?.pin}</p>
      </div>

      {/* Location */}

      <div className="card" style={{ textAlign: "center" }}>
        <h3>Location</h3>

        <p>
          <strong>Latitude :</strong> {work.order?.latitude}
        </p>

        <p>
          <strong>Longitude :</strong> {work.order?.longitude}
        </p>

        <a
          href={`https://www.google.com/maps?q=${work.order.latitude},${work.order.longitude}`}
          target="_blank"
          rel="noreferrer"
        >
          <button>View Location</button>
        </a>
      </div>

      {/* Update Status */}

      <div className="card">
        <h3>Update Work Status</h3>

        <div className="status-row">
          <label>Status</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Assigned">Assigned</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* <button onClick={updateStatus}>Update</button> */}

          <button
            onClick={updateStatus}
            disabled={
              work?.status === "Completed" || work?.status === "Cancelled"
            }
          >
            Update
          </button>

          {work?.status === "Completed" && (
            <button
              className="bill-btn"
              onClick={() => navigate(`/staff/generate-bill/${work._id}`)}
            >
              Generate Order Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsStaff;
