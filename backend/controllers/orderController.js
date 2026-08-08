const User = require("../models/userModel");
const Services = require("../models/servicesModel");
const Order = require("../models/orderModel");
const Bill = require("../models/billModel");
const Work = require("../models/workModel");
const Location = require("../models/locationModel");

const orderController = {
  bookService: async (req, res) => {
    try {
      const {
        service,
        customerName,
        email,
        phone,
        address,
        district,
        state,
        pin,
        date,
        latitude,
        longitude,
      } = req.body;

      if (
        !service ||
        !customerName ||
        !email ||
        !phone ||
        !address ||
        !district ||
        !state ||
        !pin ||
        !date ||
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          success: false,
          message: "Please fill all required fields.",
        });
      }

      const serviceData = await Services.findById(service);

      if (!serviceData) {
        return res.status(404).json({
          message: "Service not found",
        });
      }
      // Check whether the entered PIN is serviceable
      const location = await Location.findOne({ pin });

      if (!location) {
        return res.status(400).json({
          success: false,
          message: "Sorry! This service is not available in your area.",
        });
      }
      const user = await User.findOne({ _id: req.user?.id });
      if (!user) {
        return res.status(401).json({
          message: "no user found,please login",
        });
      }

      const order = await Order.create({
        user: user._id,
        service: serviceData._id,
        customerName,
        email,
        phone,
        address,
        district,
        state,
        pin,
        preferredDate: date,
        latitude,
        longitude,

        orderStatus: "Pending",
        serviceName: serviceData.servicename,
        amount: serviceData.price,
      });

      res.status(201).json({
        success: true,
        message: "order placed successfully",
        order,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },
  viewOrders: async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          message: "no user found",
        });
      }

      const orders = await Order.find({ user: req.user.id })
        .populate("service")
        .populate("staff")
        .sort({ createdAt: -1 });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const order of orders) {
        const preferredDate = new Date(order.preferredDate);
        preferredDate.setHours(0, 0, 0, 0);

        if (preferredDate < today && order.orderStatus === "Pending") {
          order.orderStatus = "Cancelled";
          await order.save();
        }
      }

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },
  viewAllOrders: async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      const orders = await Order.find()
        .populate("service")
        .populate("user")
        .sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },
  ordersDetailsAdmin: async (req, res) => {
    try {
      const { id } = req.params;
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      const order = await Order.findById(id)
        .populate("service")
        .populate("user")
        .populate("staff");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const preferredDate = new Date(order.preferredDate);
      preferredDate.setHours(0, 0, 0, 0);

      if (preferredDate < today) {
        order.orderStatus = "Cancelled";
        await order.save();
      }

      const work = await Work.findOne({ order: id }).populate("bill");
      return res.status(200).json({
        success: true,
        order,

        work,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      const order = await Order.findByIdAndUpdate(
        id,
        { orderStatus },
        { new: true },
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "order status updated successfully",
        order,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  },

  viewWorkOrders: async (req, res) => {
    try {
      const { date, month, year } = req.query;

      let filter = {};

      if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        filter.preferredDate = {
          $gte: start,
          $lte: end,
        };
      } else if (month && year) {
        const start = new Date(year, month - 1, 1);

        const end = new Date(year, month, 0);
        end.setHours(23, 59, 59, 999);

        filter.preferredDate = {
          $gte: start,
          $lte: end,
        };
      } else if (year) {
        const start = new Date(year, 0, 1);

        const end = new Date(year, 11, 31);
        end.setHours(23, 59, 59, 999);

        filter.preferredDate = {
          $gte: start,
          $lte: end,
        };
      }

      const orders = await Order.find(filter)
        .populate("service")
        .populate("staff")
        .populate("user")
        .sort({ preferredDate: 1 });

      res.status(200).json({
        orders,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  retryOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const oldOrder = await Order.findById(id);

      if (!oldOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Make sure the logged-in user owns this order
      if (oldOrder.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Allow retry only for cancelled orders
      if (oldOrder.orderStatus !== "Cancelled") {
        return res.status(400).json({
          message: "Only cancelled orders can be retried",
        });
      }

      const newOrder = await Order.create({
        user: oldOrder.user,
        service: oldOrder.service,
        customerName: oldOrder.customerName,
        email: oldOrder.email,
        phone: oldOrder.phone,
        address: oldOrder.address,
        district: oldOrder.district,
        state: oldOrder.state,
        pin: oldOrder.pin,
        latitude: oldOrder.latitude,
        longitude: oldOrder.longitude,
        preferredDate: oldOrder.preferredDate, // Change this if you want a new date
        paymentMethod: oldOrder.paymentMethod,
        amount: oldOrder.amount,

        orderStatus: "Pending",
        paymentStatus: "Pending",
        staff: null,
      });

      oldOrder.orderStatus = "Retried";
      await oldOrder.save();

      res.status(201).json({
        success: true,
        message: "Order retried successfully",
        order: newOrder,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check ownership
      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Allow cancel only if pending
      if (order.orderStatus !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "Only pending orders can be cancelled.",
        });
      }

      order.orderStatus = "Cancelled";
      await order.save();

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully.",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
  },
  userOrderDetails: async (req, res) => {
    try {
      console.log("Calling....");
      const { id } = req.params;

      const work = await Work.findOne({ order: id })
        .populate("service")
        .populate("staff")
        .populate("order");

      if (!work) {
        return res.status(404).json({
          success: false,
          message: "Work not found",
        });
      }

      const bill = await Bill.findOne({ order: id });

      res.status(200).json({
        success: true,
        order: work.order,
        service: work.service,
        staff: work.staff,
        work,
        bill,
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

module.exports = orderController;
