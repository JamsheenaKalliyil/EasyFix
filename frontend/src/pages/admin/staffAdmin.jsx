import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BASE_URL } from "../../utils/urls";
import { viewStaff } from "../../redux/staffSlice";
import "./staffAdmin.css";

const StaffAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staffs = useSelector((state) => state.staffs.staffs);

  const getStaffs = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/view-staffs`,

         {withCredentials: true,}
      );

      dispatch(viewStaff(response.data.staffs));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStaffs();
  }, []);

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h2>Staffs</h2>

        <button
          className="add-btn"
          onClick={() => navigate("/admin/add-staff")}
        >
          + Add New Staff
        </button>
      </div>

      <div className="staff-grid">
        {staffs?.map((staff) => (
          <div className="staff-card" key={staff._id}>
            <img src={staff.photo} alt={staff.name} />

            <div className="staff-content">
              <h3>{staff.name}</h3>

              {/* <p>{staff.jobRole}</p> */}
              <p>{staff.jobRole.toUpperCase()}</p>

              <div className="card-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/edit-staff/${staff._id}`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => navigate(`/admin/staff-details/${staff._id}`)}
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAdmin;
