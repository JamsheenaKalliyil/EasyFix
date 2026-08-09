const Order = require("../models/orderModel");
const Staff = require("../models/staffModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Work = require("../models/workModel");
const Review = require("../models/reviewModel");
const Salary = require("../models/salaryModel");
const staffController = {
  addStaff: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        place,
        dob,
        phone,
        gender,
        education,
        jobRole,
        experience,
        salary,

        bankName,

        accountNumber,

        agreementAccepted,
      } = req.body;

      if (
        (!name ||
          !email ||
          !password ||
          !place ||
          !dob ||
          !gender ||
          !education ||
          !jobRole ||
          !experience ||
          !salary ||
          !bankName ||
          !accountNumber ||
          !phone,
        !req.file)
      ) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(409).json({
          message: "User already exist",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "staff",
      });

      const staff = await Staff.create({
        _id: user._id,
        user: user._id,
        name,
        place,
        dob,
        phone,
        gender,
        education,
        jobRole,
        experience,
        salary,

        bankName,

        accountNumber,

        photo: req.file.path,
      });

      return res.status(200).json({
        message: "Staff added successfully",
        staff,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  editStaff: async (req, res) => {
    try {
      const { id } = req.params;

      const {
        name,
        email,
        place,
        dob,
        phone,
        gender,
        education,
        jobRole,
        experience,
        salary,
        bankName,
        accountNumber,
      } = req.body;

      const staff = await Staff.findById(id);

      if (!staff) {
        return res.status(404).json({
          message: "Staff not found",
        });
      }

      const user = await User.findById(staff.user);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check email if changed
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });

        if (emailExists) {
          return res.status(409).json({
            message: "Email already exists",
          });
        }
      }

      // Update User
      user.name = name;
      user.email = email;

      await user.save();

      // Update Staff
      staff.name = name;
      staff.place = place;
      staff.phone = phone;
      staff.dob = dob;
      staff.gender = gender;
      staff.education = education;
      staff.jobRole = jobRole;
      staff.experience = experience;
      staff.salary = salary;
      staff.bankName = bankName;
      staff.accountNumber = accountNumber;

      if (req.file) {
        staff.photo = req.file.path;
      }

      await staff.save();

      return res.status(200).json({
        message: "Staff updated successfully",
        staff,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  viewStaffs: async (req, res) => {
    try {
      const staffs = await Staff.find();

      res.status(200).json({
        message: "view staffs success",
        staffs,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "inernal server error",
      });
    }
  },

  availableStaffs: async (req, res) => {
    try {
      const { id } = req.params;

      // Get order with service details
      const order = await Order.findById(id).populate("service");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // Get all staffs for this service
      const staffs = await Staff.find({
        jobRole: order.service.servicename,
      }).populate("user");

      // Get all works on the preferred date
      const start = new Date(order.preferredDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(order.preferredDate);
      end.setHours(23, 59, 59, 999);

      const works = await Work.find({
        date: {
          $gte: start,
          $lte: end,
        },
      })
        .populate("staff")
        .populate("order");

      res.status(200).json({
        message: "Success",
        staffs,
        works,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  staffDetails: async (req, res) => {
    try {
      const { id } = req.params;

      const staff = await Staff.findById(id).populate("user");

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }
      const work = await Work.find({ staff: id });

      const review = await Review.find({ staff: id });

      res.status(200).json({
        success: true,
        staff,
        work,
        review,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
  staffProfile: async (req, res) => {
    try {
      const id = req.user.id;

      const staff = await Staff.findById(id).populate("user");

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }
      const work = await Work.find({ staff: id });

      const review = await Review.find({ staff: id });

      res.status(200).json({
        success: true,
        staff,
        work,
        review,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
  staffDashboard: async (req, res) => {
    try {
      // Logged-in staff
      const staff = await Staff.findOne({ user: req.user.id });

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: "Staff not found",
        });
      }

      

      // Today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Today's works
      const todayWorks = await Work.countDocuments({
        staff: staff._id,
        date: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      // Pending works
      const cancelledWorks = await Work.countDocuments({
        staff: staff._id,
        status: "Cancelled",
      });

      // Completed works
      const completedWorks = await Work.countDocuments({
        staff: staff._id,
        status: "Completed",
      });

       //total Work

       const totalWorks = await Work.countDocuments({
        staff: staff._id,
        
      });
      // Salary
      const salary = await Salary.findOne({
        staff: staff._id,
      });

      res.status(200).json({
        success: true,

        dashboard: {
          _id: staff._id,
          name: staff.name,
          photo: staff.photo,
          jobRole: staff.jobRole,
          experience: staff.experience,
          salary: staff.salary, // from Staff model
          salaryStatus: salary?.status || "Pending", // from Salary model
           totalWorks,
          todayWorks,
          completedWorks,
          completedWorks,
        },
        staff,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  removeStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const staff = await Staff.findById(id);

      await User.findByIdAndDelete(id);
      await Staff.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Staff removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = staffController;
