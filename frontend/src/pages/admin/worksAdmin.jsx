import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/urls";
import "./worksAdmin.css";

const WorksAdmin = () => {
  const [orders, setOrders] = useState([]);

  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/work-orders`, {
        params: {
          date,
          month,
          year,
        },
        withCredentials: true,
      });

      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [date, month, year]);

  return (
    <div className="works-admin">
      <h2>Work Assignment</h2>

      <div className="filters">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
        </select>
      </div>
      <div className="work-table-container">
        <table className="work-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Service</th>
              <th>Staff</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.preferredDate).toLocaleDateString()}</td>

                  <td>{order._id.slice(-6).toUpperCase()}</td>

                  <td>{order.service?.servicename}</td>
                  <td>{order.staff?.name}</td>

                  <td>{order.customerName}</td>
                  <td>{order.orderStatus}</td>

                  <td>
                    {order.orderStatus === "Completed" ||
                    order.orderStatus === "Cancelled" ||
                    order.orderStatus === "Retried" ? (
                      <button disabled className="assign-btn disabled-btn">
                        Go Assign
                      </button>
                    ) : (
                      <Link
                        to={`/admin/assign-staff/${order._id}`}
                        className="assign-btn"
                      >
                        Go Assign
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Orders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorksAdmin;
