import { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaEnvelope,
  FaPhoneAlt,
  FaUserCircle,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";

import "./userProfile.css";
import { BASE_URL } from "../../utils/urls";
import Swal from "sweetalert2";

const UserProfile = () => {
  const fileInputRef = useRef(null);
  const [user, setUser] = useState("");
  const [orderStats, setOrderStats] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setOrderStats(response.data.orderStats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const confirm = await Swal.fire({
      title: "Upload Profile Photo?",
      text: "Do you want to upload this photo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const preview = URL.createObjectURL(file);

    setUser((prev) => ({
      ...prev,
      photo: preview,
    }));

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/profile-photo-upload`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchProfile();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleRemovePhoto = async () => {
    const confirm = await Swal.fire({
      title: "Remove Profile Photo?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await axios.delete(`${BASE_URL}/profile-photo-remove`, {
        withCredentials: true,
      });

      await Swal.fire({
        icon: "success",
        title: "Removed",
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchProfile();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="profilePage">
      {/* PROFILE CARD */}

      <div className="profileCard">
        <div className="profileHeader">
          <div className="profileImageBox">
            {user?.photo ? (
              <img src={user.photo} alt="Profile" className="profileImage" />
            ) : (
              <FaUserCircle className="profileAvatar" />
            )}

            <div className="profileButtons">
              <button
                className="uploadBtn"
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera />
                {user?.photo ? "Change Photo" : "Upload Photo"}
              </button>

              {user?.photo && (
                <button className="removeBtn" onClick={handleRemovePhoto}>
                  Remove Photo
                </button>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImageChange}
            />
          </div>

          <div className="profileInfo">
            <h2>{user.name}</h2>

            <p>
              <FaEnvelope />
              {user.email}
            </p>

            <p>
              <FaPhoneAlt />
              {user.phone || "Not Added"}
            </p>
          </div>
        </div>
      </div>

      {/* ORDER STATISTICS */}

      <div className="statsGrid">
        <div className="statCard">
          <FaClipboardList className="statIcon total" />
          <h2>{orderStats.total}</h2>
          <span>Total Orders</span>
        </div>

        <div className="statCard">
          <FaClock className="statIcon pending" />
          <h2>{orderStats.pending}</h2>
          <span>Pending</span>
        </div>

        <div className="statCard">
          <FaCheckCircle className="statIcon completed" />
          <h2>{orderStats.completed}</h2>
          <span>Completed</span>
        </div>

        <div className="statCard">
          <FaTimesCircle className="statIcon cancelled" />
          <h2>{orderStats.cancelled}</h2>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
