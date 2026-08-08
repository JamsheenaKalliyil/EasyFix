import { useEffect, useState } from "react";
import axios from "axios";
import "./wallet.css";
import { BASE_URL } from "../../utils/urls";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchWallet = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/wallet`, {
        withCredentials: true,
      });

      setBalance(data.wallet.balance);
      setHistory(data.wallet.transactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleAddMoney = async () => {
    try {
      if (!amount || Number(amount) <= 0) {
        return alert("Enter a valid amount");
      }

      // Create Razorpay Order
      const { data } = await axios.post(
        `${BASE_URL}/admin/create-add-money`,
        { amount: Number(amount) },
        {
          withCredentials: true,
        },
      );
      console.log("Wallet API:", data);
      const options = {
        // key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "EasyFix",
        description: "Wallet Recharge",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${BASE_URL}/admin/verify-addMoney`,
              {
                amount: Number(amount),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              },
            );

            alert(verify.data.message);

            setAmount("");

            fetchWallet();
          } catch (error) {
            console.log(error);
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "Admin",
        },

        theme: {
          color: "#0f766e",
        },
      };
      console.log("path", `${BASE_URL}/admin/verify-add-money`);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Unable to start payment");
    }
  };

  return (
    <div className="walletPageContainer">
      <div className="walletCardBox">
        <h2 className="walletTitle">My Wallet</h2>

        <div className="walletBalanceBox">
          <p className="walletBalanceLabel">Available Balance</p>
          <h1 className="walletBalanceAmount">₹ {balance}</h1>
        </div>

        <div className="walletAddMoneySection">
          <h3 className="walletSectionTitle">Add Money</h3>

          <input
            className="walletMoneyInput"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="walletAddButton" onClick={handleAddMoney}>
            Add Money
          </button>
        </div>

        <button
          className="walletHistoryButton"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>

        {showHistory && (
          <div className="walletHistoryBox">
            <h3 className="walletHistoryTitle">Transaction History</h3>

            {history.length === 0 ? (
              <p>No Transactions Found</p>
            ) : (
              history
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((item) => (
                  <div className="walletTransactionItem" key={item._id}>
                    <div>
                      <p className="walletTransactionType">{item.type}</p>

                      <span className="walletTransactionDate">
                        {item.user?.name}
                      </span>
                      <span className="walletTransactionDate">
                        {item.staff?.name}
                      </span>

                      <br />

                      <span className="walletTransactionDate">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>

                    <p
                      className="walletTransactionAmount"
                      style={{
                        color: item.type === "Credit" ? "green" : "red",
                      }}
                    >
                      {item.type === "Credit" ? "+" : "-"} ₹{item.amount}
                    </p>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
