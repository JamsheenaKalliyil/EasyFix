import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import "./locationManagement.css";
import { BASE_URL } from "../../utils/urls";

const districts = [
  "Kasaragod",
  "Kannur",
  "Wayanad",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Thrissur",
  "Ernakulam",
  "Idukki",
  "Kottayam",
  "Alappuzha",
  "Pathanamthitta",
  "Kollam",
  "Thiruvananthapuram",
];

const LocationManagement = () => {
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");
  const [locations, setLocations] = useState([]);

  const [searchType, setSearchType] = useState("");
  const [search, setSearch] = useState("");

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/get-locations`, {
        withCredentials: true,
      });

      setLocations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!district || !pincode) {
      return Swal.fire("Error", "Fill all fields", "error");
    }

    try {
      await axios.post(
        `${BASE_URL}/admin/add-location`,
        { district, pincode },
        { withCredentials: true },
      );

      Swal.fire("Success", "Location Added", "success");

      setDistrict("");
      setPincode("");

      fetchLocations();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Location?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/admin/delete-location/${id}`, {
        withCredentials: true,
      });

      Swal.fire("Deleted!", "", "success");

      fetchLocations();
    } catch (err) {
      console.log(err);
    }
  };

  let filtered = [];

  if (searchType === "all") {
    filtered = locations;
  } else if (searchType === "district") {
    filtered = locations.filter((item) =>
      item.district.toLowerCase().includes(search.toLowerCase()),
    );
  } else if (searchType === "pincode") {
    filtered = locations.filter((item) =>
      (item.pincode || item.pin).toString().includes(search),
    );
  }

  return (
  <div className="userLocation-page">
    <h2 className="userLocation-title">Location Management</h2>

    <div className="userLocation-wrapper">
      {/* Left Side */}
      <div className="userLocation-left">
        <div className="userLocation-card">
          <h3 className="userLocation-section-title">
            Add New Location
          </h3>

          <form
            className="userLocation-form"
            onSubmit={handleAdd}
          >
            <label>District</label>

            <select
              className="userLocation-input"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select District</option>

              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <label>Pincode</label>

            <input
              type="number"
              className="userLocation-input"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />

            <button
              type="submit"
              className="userLocation-add-btn"
            >
              Add Location
            </button>
          </form>
        </div>
      </div>

      {/* Right Side */}

      <div className="userLocation-right">
        <div className="userLocation-card">
          <h3 className="userLocation-section-title">
            Available Locations
          </h3>

          <div className="userLocation-filter-buttons">
            <button
              className={searchType === "district" ? "active" : ""}
              onClick={() => {
                setSearchType("district");
                setSearch("");
              }}
            >
              District
            </button>

            <button
              className={searchType === "pincode" ? "active" : ""}
              onClick={() => {
                setSearchType("pincode");
                setSearch("");
              }}
            >
              Pincode
            </button>

            <button
              className={searchType === "all" ? "active" : ""}
              onClick={() => {
                setSearchType("all");
                setSearch("");
              }}
            >
              View All
            </button>
          </div>

          {searchType && searchType !== "all" && (
            <input
              className="userLocation-search-box"
              placeholder={`Search by ${searchType}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          {searchType && (
            <div className="userLocation-table-wrapper">
              <table className="userLocation-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>District</th>
                    <th>Pincode</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{item.district}</td>
                        <td>{item.pincode || item.pin}</td>

                        <td>
                          <button
                            className="userLocation-delete-btn"
                            onClick={() =>
                              handleDelete(item._id)
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        No locations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default LocationManagement;
