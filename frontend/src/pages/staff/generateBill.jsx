import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../utils/urls";
import "./generateBill.css";

const GenerateBill = () => {
  const { id } = useParams(); // Work ID
  const navigate = useNavigate();

  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);

  const [extraHours, setExtraHours] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [remarks, setRemarks] = useState("");

  const fetchWork = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/staff/order-details-staff/${id}`,
        {
          withCredentials: true,
        },
      );

      setWork(res.data.work);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch work details",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWork();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (!work) return <h2>No Work Found</h2>;

  const totalAmount =
    Number(work.order.amount) +
    +Number(extraHours * 200) +
    Number(additionalCharges);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const billData = {
      workId: work._id,
      orderId: work.order._id,
      serviceId: work.service._id,
      basicAmount: work.order.amount,
      extraHours,
      additionalCharges,
      remarks,
      totalAmount,
    };

    console.log(billData);
    try {
      const res = await axios.post(
        `${BASE_URL}/staff/generate-bill/${id}`,
        {
          extraHours,
          additionalCharges,
          remarks,
        },
        {
          withCredentials: true,
        },
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message || "Bill generated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Optional:
      navigate("/staff/my-works");
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: err.response?.data?.message || "Failed to generate bill.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="bill-container">
      <h2>Generate Bill</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name</label>
          <input type="text" value={work.service.servicename} readOnly />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" value={work.order.customerName} readOnly />
        </div>

        <div className="form-group">
          <label>Basic Amount</label>
          <input type="number" value={work.order.amount} readOnly />
        </div>

        <div className="form-group">
          <label>Extra Hours</label>
          <input
            type="number"
            min="0"
            value={extraHours}
            onChange={(e) => setExtraHours(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Additional Charges</label>
          <input
            type="number"
            min="0"
            value={additionalCharges}
            onChange={(e) => setAdditionalCharges(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Remarks</label>
          <textarea
            rows="3"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        <div className="total-box">
          <h3>Total Payable: ₹{totalAmount}</h3>
        </div>

        <button
          type="submit"
          className="bill-btn"
          disabled={!!work?.bill}
        >
          {work?.bill ? "Bill Generated" : "Generate Order Bill"}
        </button>
      </form>
    </div>
  );
};

export default GenerateBill;
