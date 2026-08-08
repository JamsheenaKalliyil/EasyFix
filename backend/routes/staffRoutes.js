const express = require("express");
const upload = require("../middlewares/multer");
const staffController = require("../controllers/staffController");
const isAuth = require("../middlewares/isAuthenticated");
const workController = require("../controllers/workController");
const reviewController = require("../controllers/reviewController");
const isStaff = require("../middlewares/isStaff");

const staffRouter = express.Router();

staffRouter.get("/my-works", isAuth, isStaff, workController.staffMyWorks);
staffRouter.get(
  "/order-details-staff/:id",
  isAuth,
  isStaff,
  workController.orderDetailsStaff,
);
staffRouter.patch(
  "/update-order-status/:id",
  isAuth,
  isStaff,
  workController.updateOrderStatus,
);
staffRouter.post(
  "/generate-bill/:id",
  isAuth,
  isStaff,
  workController.generateBill,
);
staffRouter.get(
  "/staff-dashboard",
  isAuth,
  isStaff,
  staffController.staffDashboard,
);

staffRouter.get(
  "/staff-profile",
  isAuth,
  isStaff,
  staffController.staffProfile,
);
staffRouter.get(
  "/staff-reviews",
  isAuth,
  isStaff,
  reviewController.staffReviews,
);

module.exports = staffRouter;
