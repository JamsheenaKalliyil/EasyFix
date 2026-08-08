import { useEffect, useState } from "react";
import axios from "axios";
import "./staffDashboard.css";
import { BASE_URL } from "../../utils/urls";
import {
  FaUserTie,
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaStar,
} from "react-icons/fa";

const StaffDashboard = () => {
  const [staff, setStaff] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/staff/staff-dashboard`, {
          withCredentials: true,
        });

        setStaff(response.data.staff);
        setDashboard(response.data.dashboard);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="staff-dashboard">
      <div className="profile-card">
        <img src={staff?.photo} alt="" className="staff-image" />

        <div>
          <h2>{staff?.name}</h2>

          <p className="job-role">{staff?.jobRole}</p>

          <span className="status">🟢 {staff?.status || "Available"}</span>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaClipboardList className="card-icon" />

          <h5>Total Works</h5>

          <h2>{dashboard?.totalWorks || 0}</h2>
        </div>

        <div className="dashboard-card">
          <FaCheckCircle className="card-icon" />

          <h5>Completed Works</h5>

          <h2>{dashboard?.completedWorks || 0}</h2>
        </div>

        <div className="dashboard-card">
          <FaClock className="card-icon" />

          <h5>Cancelled Works</h5>

          <h2>{dashboard?.cancelledWorks || 0}</h2>
        </div>

        <div className="dashboard-card">
          <FaStar className="card-icon" />

          <h5>Rating</h5>

          <h2>{dashboard?.rating || "5.0"} ⭐</h2>
        </div>
      </div>

      <div className="summary-card">
        <h3>
          <FaUserTie /> Performance Summary
        </h3>

        <div className="summary-grid">
          <div>
            <span>Total Works</span>
            <h4>{staff?.completedWorks || 0}</h4>
          </div>

          <div>
            <span>Experience</span>
            <h4>{staff?.experience} Years</h4>
          </div>

          <div>
            <span>Job Role</span>
            <h4>{staff?.jobRole}</h4>
          </div>

          <div>
            <span>Status</span>
            <h4>{staff?.status || "Available"}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
