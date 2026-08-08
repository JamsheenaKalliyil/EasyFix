import { useEffect, useState } from "react";
import axios from "axios";
import { Link} from "react-router-dom";

import "./assignedWorks.css";
import { BASE_URL } from "../../utils/urls";

const AssignedWorks = () => {
  
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/staff/my-works`, {
        withCredentials: true,
      });

      setWorks(res.data.works);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="assigned-container">
      <h2>My Works</h2>

      <table className="works-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Service</th>
            <th> Work Date</th>
            <th>Shift</th>

            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {works.length > 0 ? (
            works.map((work) => (
              <tr key={work._id}>
                <td>{new Date(work.date).toLocaleDateString("en-GB")}</td>

                <td>{work.user?.name}</td>

                <td>{work.service?.servicename}</td>
                <td>{work.date}</td>

                <td>{work.shift}</td>

                <td>
                  <span className={`status ${work.status}`}>{work.status}</span>
                </td>

                <td>
                  {work.order?.paymentStatus === "Paid" ||
                  work.order?.paymentStatus === "Refunded" ? (
                    <button className="closed-btn">Closed</button>
                  ) : new Date(work.date).toDateString() ===
                    new Date().toDateString() ? (
                    <Link
                      to={`/staff/order-details-staff/${work._id}`}
                      className="view-btn"
                    >
                      View Details
                    </Link>
                  ) : new Date() > new Date(work.date) ? (
                    <button className="not-completed-btn" disabled>
                      Not Completed
                    </button>
                  ) : (
                    <button className="upcoming-btn" disabled>
                      {new Date(work.date).toLocaleDateString()}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No works assigned.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedWorks;
