import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import "./orderAdmin.css";
import { useDispatch, useSelector } from "react-redux";
import { viewAllOrders } from "../../redux/orderSlice";

const OrderAdmin = () => {
  const orders = useSelector((state) => state.orders.adminOrders);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/view-all-orders`, {
        withCredentials: true,
      });

      dispatch(viewAllOrders(response.data.orders));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  
  return (
  <div className="order-admin">
    <h2>All Orders</h2>

    <div className="order-table-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Order ID</th>
            <th>Service</th>
            <th>User</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>

                <td>{order._id.slice(-8)}</td>

                <td>
                  <div className="service-info">
                    <img
                      src={order.service?.image}
                      alt={order.service?.servicename}
                    />

                    <span>{order.service?.servicename}</span>
                  </div>
                </td>

                <td>{order.user?.name}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/admin/order-details/${order._id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default OrderAdmin;
