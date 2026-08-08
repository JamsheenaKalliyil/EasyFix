import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/urls";
import "./salaryManagement.css";
const SalaryManagement = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [staffs, setStaffs] = useState([]);

  const fetchSalaries = async () => {
    try {
      const [year, selectedMonth] = month.split("-");

      const { data } = await axios.get(`${BASE_URL}/admin/staff-salaries`, {
        params: {
          month: Number(selectedMonth),
          year: Number(year),
        },
        withCredentials: true,
      });

      setStaffs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [month]);

  const paySalary = async (salaryId, staffId) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/pay-salary`,
        {
          salaryId,
          staffId,
          month: Number(month.split("-")[1]),
          year: Number(month.split("-")[0]),
        },
        { withCredentials: true },
      );

      fetchSalaries();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="salaryPage">
      <h2>Salary Management</h2>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <table className="salaryTable">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Service</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Paid Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.staffId}>
              <td>
                <img
                  src={staff.image}
                  alt={staff.name}
                  width="55"
                  height="55"
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </td>

              <td>{staff.name}</td>

              <td>{staff.service}</td>

              <td>₹ {staff.salary}</td>

              <td>
                {staff.status === "Paid" ? (
                  <span style={{ color: "green" }}>Paid</span>
                ) : (
                  <span style={{ color: "red" }}>Pending</span>
                )}
              </td>

              <td>
                {staff.paidDate
                  ? new Date(staff.paidDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {staff.status === "Paid" ? (
                  <button disabled>Paid</button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => paySalary(staff.salaryId, staff.staffId)}
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryManagement;
