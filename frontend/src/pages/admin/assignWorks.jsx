import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils/urls";
import "./assignWorks.css";

const AssignWorks = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [staffs, setStaffs] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Order Details
  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/order-details/${id}`, {
        withCredentials: true,
      });

      setOrder(res.data.order);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Unable to fetch order.",
      });
    }
  };

  // Fetch Staffs & Works
  const fetchStaffs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/available-staffs/${id}`, {
        withCredentials: true,
      });

      setStaffs(res.data.staffs);
      setWorks(res.data.works);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Unable to fetch staffs.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Assign Work
  const assignWork = async (staffId, shift) => {
    try {
      await axios.post(
        `${BASE_URL}/admin/assign-work`,
        {
          orderId: id,
          staffId,
          shift,
        },
        {
          withCredentials: true,
        },
      );

      Swal.fire({
        icon: "success",
        title: "Assigned",
        text: "Work assigned successfully.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchOrder();
      fetchStaffs();
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  // Unassign Work
  const unassignWork = async (staffId, shift) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/unassign-work`,
        {
          orderId: id,
          staffId,
          shift,
        },
        {
          withCredentials: true,
        },
      );

      Swal.fire({
        icon: "success",
        title: "Unassigned",
        text: "Work unassigned successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchOrder();
      fetchStaffs();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }
  };
  // Find work of a staff in a particular shift
  const getWork = (staffId, shift) => {
    return works.find(
      (work) =>
        work.staff?._id.toString() === staffId.toString() &&
        work.shift === shift,
    );
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchOrder();
      await fetchStaffs();
    };

    loadData();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="assign-work-container">
      <h2>Assign Staff</h2>

      <div className="order-info">
        <p>
          <strong>Service :</strong> {order.service.servicename}
        </p>

        <p>
          <strong>Customer :</strong> {order.customerName}
        </p>

        <p>
          <strong>Date :</strong>{" "}
          {new Date(order.preferredDate).toLocaleDateString()}
        </p>
      </div>

      <table className="assign-table">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Morning</th>
            <th>Afternoon</th>
            <th>Evening</th>
          </tr>
        </thead>

        <tbody>
          {staffs.map((staff) => (
            <tr key={staff._id}>
              <td>
                <strong>{staff.name}</strong>
                <br />
                <small>{staff.jobRole.toUpperCase()}</small>
              </td>

              {["morning", "afternoon", "evening"].map((shift) => {
                const work = getWork(staff._id, shift);

                return (
                  <td key={shift}>
                    {!work ? (
                      <button
                        className="assign-btn"
                        onClick={() => assignWork(staff._id, shift)}
                      >
                        Assign
                      </button>
                    ) : work.order._id === id && work.status === "Assigned" ? (
                      <button
                        className="unassign-btn"
                        onClick={() => unassignWork(staff._id, shift)}
                      >
                        Unassign
                      </button>
                    ) : (
                      <button disabled>{work.status}</button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignWorks;
