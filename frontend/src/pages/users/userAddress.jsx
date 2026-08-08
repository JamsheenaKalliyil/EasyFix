import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import "./userAddress.css";
import { BASE_URL } from "../../utils/urls";
import { useNavigate } from "react-router-dom";

const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/user-address`, {
        withCredentials: true,
      });
      setAddresses(data.addresses);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Address?",
      text: "This address will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/delete-address/${id}`, {
        withCredentials: true,
      });

      Swal.fire("Deleted!", "Address removed.", "success");
      fetchAddresses();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  return (
    <div className="address-container">
      <div className="address-header">
        <h3>My Addresses</h3>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-address")}
        >
          <FaPlus /> Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center mt-5">No address added.</p>
      ) : (
        <div className="address-grid">
          {addresses.map((item) => (
            <div className="address-card" key={item._id}>
              <h5>{item.customerName}</h5>

              <p>{item.phone}</p>
              <p>{item.email}</p>

              <p>
                {item.address},
                {/* <br />
                {item.place}, */}
                <br />
                {item.district} - {item.pin}
                <br />
                {item.state}
              </p>

              <div className="address-actions">
                {/* <button className="btn btn-outline-primary btn-sm">
                  <FaEdit /> Edit
                </button> */}

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAddress;
