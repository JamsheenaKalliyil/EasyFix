const Bill = require("../models/billModel");
const Order = require("../models/orderModel");
const Staff = require("../models/staffModel");
const Work = require("../models/workModel");

const workController = {
  assignWork: async (req, res) => {
    try {
      const { orderId, staffId, shift } = req.body;

      if (!orderId || !staffId || !shift) {
        return res.status(400).json({
          message: "Incomplete data",
        });
      }

      const validShifts = ["morning", "afternoon", "evening"];

      if (!validShifts.includes(shift)) {
        return res.status(400).json({
          message: "Invalid shift",
        });
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (order.staff) {
        return res.status(400).json({
          message: "Staff already assigned",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const preferredDate = new Date(order.preferredDate);
      preferredDate.setHours(0, 0, 0, 0);

      if (preferredDate < today) {
        order.orderStatus = "Cancelled";
        await order.save();

        return res.status(400).json({
          message: "Preferred date has passed. Order cancelled.",
        });
      }

      const staff = await Staff.findById(staffId);

      if (!staff) {
        return res.status(404).json({
          message: "Staff not found",
        });
      }

      // Check whether staff already has work on same date & shift
      const existingWork = await Work.findOne({
        staff: staffId,
        date: preferredDate,
        shift,
      });

      if (existingWork) {
        return res.status(400).json({
          message: `${staff.name} is already assigned on this date and shift.`,
        });
      }

      // Assign staff to order
      order.staff = staffId;
      order.orderStatus = "Assigned";
      await order.save();

      // Create work
      const work = await Work.create({
        date: preferredDate,
        shift,
        user: order.user,
        service: order.service,
        order: order._id,
        staff: staff._id,
        status: "Assigned",
      });

      await Staff.findByIdAndUpdate(staffId, {
        $push: {
          works: work._id,
        },
      });

      const updatedStaff = await Staff.findById(staffId).populate("user");
      const filteredWork = await Work.find({ date: preferredDate })
        .populate("staff")
        .populate("order")
        .populate("user")
        .populate("service");

      res.status(200).json({
        message: "Staff assigned successfully",
        staff: updatedStaff,
        // work: filteredWork,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  unassignWork: async (req, res) => {
    try {
      const { orderId } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
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

        return res.status(400).json({
          message: "Preferred date has passed. Order cancelled.",
        });
      }
      // Remove work
      await Work.findOneAndDelete({
        order: orderId,
      });

      // Reset order
      order.staff = null;
      order.orderStatus = "Pending";
      await order.save();

      const work = await Work.findOneAndDelete({ order: orderId });

      if (work) {
        await Staff.findByIdAndUpdate(work.staff, {
          $pull: {
            works: work._id,
          },
        });
      }

      res.status(200).json({
        message: "Work unassigned successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  staffMyWorks: async (req, res) => {
    try {
      const staffId = req.user.id;

      const works = await Work.find({ staff: staffId })
        .populate("user", "name")
        .populate("service", "servicename")
        .populate("order")
        .sort({ date: -1 });

      res.status(200).json({
        success: true,
        works,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  orderDetailsStaff: async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await Staff.findOne({ user: req.user.id });

      const work = await Work.findOne({
        _id: id,
        staff: staff._id,
      })
        .populate("service")
        .populate("user")
        .populate("order")
        .populate("staff");

      if (!work) {
        return res.status(404).json({
          success: false,
          message: "Work not found",
        });
      }

      return res.status(200).json({
        success: true,
        work,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log("status", status);

      if (!["Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const work = await Work.findById(id);

      if (!work) {
        return res.status(404).json({
          success: false,
          message: "Work not found",
        });
      }

      // Update work status
      work.status = status;
      await work.save();

      // Update related order status
      const order = await Order.findById(work.order);

      if (order) {
        order.orderStatus = status;
        await order.save();
      }

      const updatedWork = await Work.findById(id)
        .populate("service")
        .populate("user")
        .populate("order")
        .populate("staff");

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        work: updatedWork,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  generateBill: async (req, res) => {
    try {
      const { id } = req.params; // Work ID

      const { extraHours, additionalCharges, remarks } = req.body;

      const work = await Work.findById(id)
        .populate("order")
        .populate("service")
        .populate("staff")
        .populate("user");

      if (!work) {
        return res.status(404).json({
          success: false,
          message: "Work not found",
        });
      }

      // Prevent duplicate bill
      if (work.bill) {
        return res.status(400).json({
          success: false,
          message: "Bill already generated",
        });
      }

      const basicAmount = work.order.amount;

      const totalAmount =
        Number(basicAmount) +
        Number(extraHours * 200) +
        Number(additionalCharges);

      const bill = await Bill.create({
        work: work._id,
        order: work.order._id,
        user: work.user._id,
        staff: work.staff._id,
        service: work.service._id,

        basicAmount,
        extraHours,
        additionalCharges,
        remarks,
        totalAmount,
      });

      work.bill = bill._id;
      await work.save();

      return res.status(201).json({
        success: true,
        message: "Bill generated successfully",
        bill,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },

  getBill: async (req, res) => {
    try {
      const { id } = req.params;

      const bill = await Bill.findOne({ order: id })
        .populate("staff")
        .populate("work")
        .populate("service");

      if (!bill) {
        return res.status(404).json({
          message: "Bill not found",
        });
      }

      res.status(200).json({
        success: true,
        bill,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = workController;
