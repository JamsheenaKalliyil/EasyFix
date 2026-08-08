import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./staffDetails.css";
import Swal from "sweetalert2";

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [works, setWorks] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/admin/staff-details/${id}`,
          {
            withCredentials: true,
          },
        );

        setStaff(response.data.staff);
        setWorks(response.data.work);
        setReviews(response.data.review);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStaff();
  }, [id]);

  const handleRemoveStaff = async () => {
    const result = await Swal.fire({
      title: "Remove Staff?",
      text: "This staff member will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/remove-staff/${id}`,
        {
          withCredentials: true,
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Removed!",
        text: response.data.message,
      });

      navigate("/admin/staff");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (!staff) return <h2>Loading...</h2>;

  return (
    <div className="staff-detail-page">
      <div className="staff-detail-container">
        <h2 className="staff-detail-title">Staff Details</h2>

        {/* Profile */}

        <div className="staff-profile-card">
          <div className="staff-profile-image">
            <img src={staff.photo} alt={staff.name} />
          </div>

          <div className="staff-profile-info">
            <div className="staff-info-item">
              <span>Name</span>
              <p>{staff.name}</p>
            </div>

            <div className="staff-info-item">
              <span>Email</span>
              <p>{staff.user.email}</p>
            </div>

            <div className="staff-info-item">
              <span>Phone</span>
              <p>{staff.phone}</p>
            </div>

            <div className="staff-info-item">
              <span>Place</span>
              <p>{staff.place}</p>
            </div>

            <div className="staff-info-item">
              <span>DOB</span>
              <p>{new Date(staff.dob).toLocaleDateString()}</p>
            </div>

            <div className="staff-info-item">
              <span>Gender</span>
              <p>{staff.gender}</p>
            </div>

            <div className="staff-info-item">
              <span>Education</span>
              <p>{staff.education}</p>
            </div>

            <div className="staff-info-item">
              <span>Job Role</span>
              <p>{staff.jobRole}</p>
            </div>

            <div className="staff-info-item">
              <span>Experience</span>
              <p>{staff.experience} Years</p>
            </div>

            <div className="staff-info-item">
              <span>Salary</span>
              <p>₹ {staff.salary}</p>
            </div>

            <div className="staff-info-item">
              <span>Bank</span>
              <p>{staff.bankName}</p>
            </div>

            <div className="staff-info-item">
              <span>Account No</span>
              <p>{staff.accountNumber}</p>
            </div>
          </div>
        </div>

        {/* Performance */}

        <div className="staff-performance-section">
          <div className="staff-performance-card">
            <h4>Assigned Works</h4>
            <p>{works.length}</p>
          </div>

          <div className="staff-performance-card">
            <h4>Total Reviews</h4>
            <p>{reviews.length}</p>
          </div>
        </div>

        {/* Works */}

        <div className="staff-work-section">
          <h3>Assigned Works</h3>

          <table className="staff-work-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {works.length > 0 ? (
                works.map((work) => (
                  <tr key={work._id}>
                    <td>{new Date(work.date).toLocaleDateString()}</td>

                    <td>{work.shift}</td>

                    <td>{work.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Works Assigned</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reviews */}

        <div className="staff-review-section">
          <h3>Customer Reviews</h3>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="staff-review-card">
                <h4> {review.customerName}</h4>
                <p>{review.rating}⭐</p>
                <p>{review.review}</p>
              </div>
            ))
          ) : (
            <p>No Reviews Yet</p>
          )}
        </div>

        <button className="staff-remove-button" onClick={handleRemoveStaff}>
          Remove Staff
        </button>
      </div>
    </div>
  );
};

export default StaffDetails;
