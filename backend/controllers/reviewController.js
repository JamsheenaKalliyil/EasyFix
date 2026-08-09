const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const Staff = require("../models/staffModel");

const reviewController = {
  addReview: async (req, res) => {
    try {
      const { rating, review } = req.body;
      const orderId = req.params.id;

      // Check order exists
      const order = await Order.findById(orderId)
        .populate("user")
        .populate("staff")
        .populate("service");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Ensure logged-in user owns the order
      if (order.user._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Prevent duplicate review
      const existingReview = await Review.findOne({ order: orderId });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "Review already submitted",
        });
      }

      // Create review
      const newReview = await Review.create({
        user: req.user.id,
        customerName: order.customerName,
        staff: order.staff,
        service: order.service,
        order: order._id,
        rating,
        review,
      });

      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        review: newReview,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  myReviews: async (req, res) => {
    try {
      const reviews = await Review.find({
        user: req.user.id,
      })
        .populate("service")
        .sort({ createdAt: -1 });

      return res.json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  staffReviews: async (req, res) => {
    try {
      const staff = await Staff.findOne({ user: req.user.id });

      const reviews = await Review.find({ staff: staff._id })
        .populate("user", "name")
        .populate("service", "servicename")
        .populate("order")
        .sort({ createdAt: -1 });

      res.json({ success: true, reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getHomeReviews: async (req, res) => {
    try {
      const reviews = await Review.find()
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(3);

      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = reviewController;
