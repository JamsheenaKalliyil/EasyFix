const express = require("express");
const servicesController = require("../controllers/servicesContoller");
const upload = require("../middlewares/multer");
const staffController = require("../controllers/staffController");
const userController = require("../controllers/userController");
const orderController = require("../controllers/orderController");
const isAuth = require("../middlewares/isAuthenticated");
const workController = require("../controllers/workController");
const walletController = require("../controllers/walletController");
const paymentController = require("../controllers/paymentController");
const locationController = require("../controllers/locationController");
const adminController = require("../controllers/adminController");
const isAdmin = require("../middlewares/isAdmin");

const adminRouter = express.Router();

adminRouter.get("/dashboard", isAuth,isAdmin, adminController.adminDashboard);
adminRouter.get("/services", isAuth,isAdmin, servicesController.viewServices);
adminRouter.post(
  "/add-services",isAuth,isAdmin,
  upload.single("image"),
  servicesController.addServices,
);
adminRouter.post(
  "/add-staff",
  isAuth,isAdmin,
  upload.single("photo"),
  staffController.addStaff,
);
adminRouter.put(
  "/edit-staff/:id",
  isAuth,isAdmin,
  upload.single("photo"),
  staffController.editStaff,
);
adminRouter.get(
  "/view-staffs",
  isAuth,isAdmin,

  staffController.viewStaffs,
);
adminRouter.get(
  "/staff-details/:id",
  isAuth,isAdmin,

  staffController.staffDetails,
);

adminRouter.get(
  "/view-all-users",
  isAuth,isAdmin,

  userController.viewAllUsers,
);
adminRouter.patch(
  "/block-user/:id",
  isAuth,isAdmin,

  userController.blockUser,
);
adminRouter.get(
  "/view-all-orders",
  isAuth,isAdmin,

  orderController.viewAllOrders,
);
adminRouter.get(
  "/order-details/:id",
  isAuth,isAdmin,

  orderController.ordersDetailsAdmin,
);
adminRouter.patch(
  "/update-order-status/:id",
  isAuth,isAdmin,
  orderController.updateOrderStatus,
);
adminRouter.get(
  "/available-staffs/:id",
  isAuth,isAdmin,
  staffController.availableStaffs,
);
adminRouter.post("/assign-work", isAuth,isAdmin, workController.assignWork);
adminRouter.patch("/unassign-work", isAuth,isAdmin, workController.unassignWork);
adminRouter.get("/work-orders", isAuth,isAdmin, orderController.viewWorkOrders);
adminRouter.put(
  "/edit-service/:id",
  isAuth,isAdmin,
  upload.single("image"),
  servicesController.editService,
);
adminRouter.get("/wallet", isAuth,isAdmin, walletController.getWallet);
adminRouter.post("/create-add-money", isAuth,isAdmin, walletController.createAddMoney);

adminRouter.post("/verify-addMoney", isAuth,isAdmin, walletController.verifyAddMoney);
adminRouter.get("/staff-salaries", isAuth,isAdmin, paymentController.getStaffSalaries);
adminRouter.patch("/pay-salary", isAuth,isAdmin, paymentController.paySalary);
adminRouter.delete("/remove-staff/:id", isAuth,isAdmin, staffController.removeStaff);
adminRouter.delete(
  "/remove-service/:id",
  isAuth,isAdmin,
  servicesController.removeService,
);
adminRouter.post("/add-location", isAuth,isAdmin, locationController.addLocation);
adminRouter.get("/get-locations", isAuth, locationController.getLocations);
adminRouter.delete(
  "/delete-location/:id",
  isAuth,isAdmin,
  locationController.deleteLocation,
);

module.exports = adminRouter;
