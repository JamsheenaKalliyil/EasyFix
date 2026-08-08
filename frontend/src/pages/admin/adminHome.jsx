// export default AdminHome;

import { useEffect, useState } from "react";
import axios from "axios";
import "./adminHome.css";
import { BASE_URL } from "../../utils/urls";

import {
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaBoxOpen,
  FaArrowUp,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const AdminHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/dashboard`, {
        withCredentials: true,
      });

      setDashboard(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-body">
        <h3 style={{ textAlign: "center", marginTop: "100px" }}>
          Loading Dashboard...
        </h3>
      </div>
    );
  }

  const chartData = {
    labels: dashboard?.monthlyRevenue?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: dashboard?.monthlyRevenue?.map((item) => item.revenue) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="admin-body">
      <div className="dashboard-wrapper">
        {/* Header */}

        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, Admin 👋</p>
          </div>
        </div>

        {/* Statistics */}

        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="dashboard-card">
              <div>
                <small>Total Users</small>
                <h3>{dashboard.totalUsers}</h3>
                <span className="text-success">
                  <FaArrowUp /> Users
                </span>
              </div>

              <div className="card-icon bg-primary">
                <FaUsers />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="dashboard-card">
              <div>
                <small>Total Orders</small>
                <h3>{dashboard.totalOrders}</h3>
                <span className="text-success">
                  <FaArrowUp /> Orders
                </span>
              </div>

              <div className="card-icon bg-success">
                <FaShoppingCart />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="dashboard-card">
              <div>
                <small>Total Revenue</small>
                <h3>₹{dashboard.totalRevenue}</h3>
                <span className="text-success">
                  <FaArrowUp /> Revenue
                </span>
              </div>

              <div className="card-icon bg-warning">
                <FaRupeeSign />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="dashboard-card">
              <div>
                <small>Total Services</small>
                <h3>{dashboard.totalServices}</h3>
                <span className="text-success">
                  <FaArrowUp /> Services
                </span>
              </div>

              <div className="card-icon bg-danger">
                <FaBoxOpen />
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}

        <div className="row mt-4">
          <div className="col-lg-8">
            <div className="chart-card">
              <h5>Monthly Revenue</h5>

              <Line data={chartData} options={options} />
            </div>
          </div>

          {/* Today */}

          <div className="col-lg-4">
            <div className="summary-card">
              <h5>Today's Summary</h5>

              <div className="summary-item">
                <span>Orders</span>
                <strong>{dashboard.todayOrders}</strong>
              </div>

              <div className="summary-item">
                <span>Revenue</span>
                <strong>₹{dashboard.todayRevenue}</strong>
              </div>

              <div className="summary-item">
                <span>New Users</span>
                <strong>{dashboard.todayUsers}</strong>
              </div>

              <div className="summary-item">
                <span>Completed Works</span>
                <strong>{dashboard.todayCompletedServices}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}

        <div className="table-card mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Recent Orders</h5>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Staff Name</th>
                  <th> Order Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-6)}</td>

                    <td>{order.customerName}</td>

                    <td>
                      {new Date(order?.preferredDate).toLocaleDateString()}
                    </td>

                    <td>{order.staff?.name ?? "Not Assigned"}</td>

                    <td>
                      <span
                        className={`badge ${
                          order.orderStatus === "Completed"
                            ? "bg-success"
                            : order.orderStatus === "Cancelled"
                              ? "bg-danger"
                              : order.orderStatus === "Assigned"
                                ? "bg-primary"
                                : "bg-warning"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
