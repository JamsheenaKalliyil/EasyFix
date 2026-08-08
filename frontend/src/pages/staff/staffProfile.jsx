import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./staffProfile.css";

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/staff/staff-profile`, {
        withCredentials: true,
      });

      setStaff(res.data.staff);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!staff) return <h2>Loading...</h2>;

  return (
    <div className="staff-profile-container">
      <div className="staff-profile-card">
        <div className="staff-image-section">
          <img src={staff.photo} alt={staff.name} className="staff-photo" />
          <h2>{staff.name}</h2>
          <p>{staff.jobRole}</p>
        </div>

        <div className="staff-details">
          <div className="detail">
            <label>Email</label>
            <p>{staff.user?.email}</p>
          </div>

          <div className="detail">
            <label>Phone</label>
            <p>{staff.phone}</p>
          </div>

          <div className="detail">
            <label>Gender</label>
            <p>{staff.gender}</p>
          </div>

          <div className="detail">
            <label>Date of Birth</label>
            <p>{new Date(staff.dob).toLocaleDateString()}</p>
          </div>

          <div className="detail">
            <label>Place</label>
            <p>{staff.place}</p>
          </div>

          <div className="detail">
            <label>Education</label>
            <p>{staff.education}</p>
          </div>

          <div className="detail">
            <label>Experience</label>
            <p>{staff.experience} Years</p>
          </div>

          <div className="detail">
            <label>Salary</label>
            <p>₹ {staff.salary}</p>
          </div>

          <div className="detail">
            <label>Account Number</label>
            <p>{staff.accountNumber}</p>
          </div>

          <div className="detail">
            <label>Bank Name</label>
            <p>{staff.bankName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
