const Address = require("../models/addressModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const profileController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const totalOrders = await Order.countDocuments({
        user: req.user.id,
      });

      const pendingOrders = await Order.countDocuments({
        user: req.user.id,
        orderStatus: "Pending",
      });

      const completedOrders = await Order.countDocuments({
        user: req.user.id,
        orderStatus: "Completed",
      });

      const cancelledOrders = await Order.countDocuments({
        user: req.user.id,
        orderStatus: "Cancelled",
      });

      res.status(200).json({
        success: true,
        user,
        orderStats: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getUserAddress: async (req, res) => {
    try {
      const userId = req.user.id;

      const addresses = await Address.find({ user: userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  },

  addAddress: async (req, res) => {
    try {
      const userId = req.user.id;

      const { customerName, email, phone, address, district, state, pin } =
        req.body;

      if (
        !customerName ||
        !email ||
        !phone ||
        !address ||
        !district ||
        !state ||
        !pin
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }

      const newAddress = await Address.create({
        user: userId,
        customerName,
        email,
        phone,
        address,
        district,
        state,
        pin,
      });

      res.status(201).json({
        success: true,
        message: "Address added successfully.",
        address: newAddress,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;

      const address = await Address.findOneAndDelete({
        _id: id,
        user: req.user.id, // Ensures users can delete only their own address
      });

      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }

      return res.json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
};

module.exports = profileController;
