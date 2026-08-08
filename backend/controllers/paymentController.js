const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");
const Bill = require("../models/billModel");
const Wallet = require("../models/walletModel");
const Staff = require("../models/staffModel");
const Salary = require("../models/salaryModel");

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const { orderId } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const bill = await Bill.findOne({ order: orderId });
      const options = {
        amount: bill.totalAmount * 100, // convert rupees to paise
        currency: "INR",
        receipt: order._id.toString(),
      };

      const razorpayOrder = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Unable to create payment order",
      });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      } = req.body;

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature === razorpay_signature) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "Paid",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        });
      
        const bill = await Bill.findOneAndUpdate(
          { order: orderId },
          { paymentStatus: "Paid" },
        );
        const order = await Order.findOne({ _id: orderId });
         
        let wallet = await Wallet.findOne();

        if (!wallet) {
          wallet = await Wallet.create({});
        }

        wallet.balance += order.amount;

        wallet.transactions.push({
          type: "Credit",
          amount: bill.totalAmount,
          user: order.user,
          order: order._id,
        });

        await wallet.save();
        return res.json({
          success: true,
          message: "Payment verified successfully",
          
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid payment signature",
        });
      }
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  /*staff salary*/

  getStaffSalaries: async (req, res) => {
    try {
      const { month, year } = req.query;

      const staffs = await Staff.find().populate("user");

      const salaries = await Salary.find({
        month,
        year,
      });

      const data = staffs.map((staff) => {
        const salary = salaries.find(
          (item) => item.staff.toString() === staff._id.toString(),
        );

        return {
          staffId: staff._id,
          salaryId: salary?._id || null,
          name: staff.name,
          image: staff.photo,
          service: staff.jobRole,
          salary: staff.salary,
          status: salary?.status || "Pending",
          paidDate: salary?.paidDate || null,
        };
      });

      res.json(data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
  paySalary: async (req, res) => {
    try {
      const { staffId, month, year } = req.body;

      const staff = await Staff.findById(staffId);

      if (!staff) {
        return res.status(404).json({
          message: "Staff not found",
        });
      }

      const wallet = await Wallet.findOne();

      if (wallet.balance < staff.salary) {
        return res.status(400).json({
          message: "Insufficient wallet balance",
        });
      }

      wallet.balance -= staff.salary;

      wallet.transactions.push({
        type: "Debit",
        amount: staff.salary,
        staff: staffId,
      });

      await wallet.save();

      let salary = await Salary.findOne({
        staff: staffId,
        month,
        year,
      });

      if (!salary) {
        salary = await Salary.create({
          staff: staffId,
          month,
          year,
          salary: staff.salary,
          status: "Paid",
          paidDate: new Date(),
        });
      } else {
        salary.status = "Paid";
        salary.paidDate = new Date();

        await salary.save();
      }

      res.json({
        message: "Salary paid successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = paymentController;
