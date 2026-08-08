const razorpay = require("../config/razorpay");
const Wallet = require("../models/walletModel");
const crypto = require("crypto");
const walletController = {
  getWallet: async (req, res) => {
    try {
      let wallet = await Wallet.findOne()
        .populate("transactions.user")
        .populate("transactions.staff");

      if (!wallet) {
        wallet = await Wallet.create({});
      }

      res.status(200).json({
        success: true,
        wallet,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  createAddMoney: async (req, res) => {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount",
        });
      }

      const options = {
        amount: Number(amount) * 100,
        currency: "INR",
        receipt: `wallet_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        order: razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }
  },
  verifyAddMoney: async (req, res) => {
    try {
      
      const {
        amount,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }

      let wallet = await Wallet.findOne();

      if (!wallet) {
        wallet = await Wallet.create({});
      }
      wallet.balance += Number(amount);
      wallet.transactions.push({
        type: "Credit",
        amount: Number(amount),
      });

      await wallet.save();

      res.status(200).json({
        success: true,
        message: "Money added successfully",
        balance: wallet.balance,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
};

module.exports = walletController;
