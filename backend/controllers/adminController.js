const Bill = require("../models/billModel");
const Order = require("../models/orderModel");
const Services = require("../models/servicesModel");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");

const adminController = {
  adminDashboard: async (req, res) => {
    try {
      // =========================
      // Dashboard Cards
      // =========================

      const totalUsers = await User.countDocuments({ role: "user" });

      const totalOrders = await Order.countDocuments();

      const totalServices = await Services.countDocuments();

      // =========================
      // Total Revenue
      // =========================

      const totalRevenueData = await Bill.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

      const totalStaffs = await Staff.countDocuments();

      const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

      // =========================
      // Today's Date
      // =========================

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      // =========================
      // Today's Orders
      // =========================

      const todayOrders = await Order.countDocuments({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      // =========================
      // Today's Revenue
      // =========================

      const todayRevenueData = await Bill.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            createdAt: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

      const todayRevenue = todayRevenueData[0]?.totalRevenue || 0;

      // =========================
      // Today's Users
      // =========================

      const todayUsers = await User.countDocuments({
        role: "user",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      // =========================
      // Today's Completed Works
      // =========================

      const todayCompletedServices = await Order.countDocuments({
        orderStatus: "Completed",
        createdAt: {
          $gte: start,
          $lte: end,
        },
      });

      // =========================
      // Monthly Revenue
      // =========================

      const revenue = await Bill.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },
            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyRevenue = months.map((month, index) => {
        const found = revenue.find((item) => item._id.month === index + 1);

        return {
          month,
          revenue: found ? found.revenue : 0,
        };
      });

      // =========================
      // Recent Orders
      // =========================

      const recentOrders = await Order.find()
        .populate("user", "name")
        .populate("staff")
        .sort({ createdAt: -1 })
        .limit(5);

      // =========================
      // Response
      // =========================

      res.status(200).json({
        totalUsers,
        totalOrders,
        totalServices,
        totalRevenue,
        totalStaffs,

        todayOrders,
        todayRevenue,
        todayUsers,
        todayCompletedServices,

        monthlyRevenue,

        recentOrders,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = adminController;
