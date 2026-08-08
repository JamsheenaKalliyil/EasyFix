const express = require("express");
const userController = require("../controllers/userController");
const servicesController = require("../controllers/servicesContoller");
const orderController = require("../controllers/orderController");
const isAuth = require("../middlewares/isAuthenticated");
const profileController = require("../controllers/profileContoller");
const workController = require("../controllers/workController");
const paymentController = require("../controllers/paymentController");
const reviewController = require("../controllers/reviewController");
const locationController = require("../controllers/locationController");
const upload = require("../middlewares/multer");
const favoriteController = require("../controllers/favoriteController");
const isUser = require("../middlewares/isUser");
// const upload = require("../middlewares/multer");
const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/signin", userController.signin);
userRouter.post("/signout", isAuth, userController.signout);
userRouter.post("/send-otp", userController.sendOtp);
userRouter.post("/verify-otp", userController.verifyOtp);
userRouter.post("/reset-password", userController.resetPassword);
userRouter.get("/services", servicesController.viewServices);
userRouter.post("/book-service", isAuth, isUser, orderController.bookService);
userRouter.get("/view-orders", isAuth, isUser, orderController.viewOrders);
userRouter.get("/profile", isAuth, isUser, profileController.getProfile);
userRouter.post("/retry-order/:id", isAuth, isUser, orderController.retryOrder);
userRouter.patch(
  "/cancel-order/:id",
  isAuth,
  isUser,
  orderController.cancelOrder,
);
userRouter.get("/get-bill/:id", isAuth, isUser, workController.getBill);
userRouter.post(
  "/create-payment",
  isAuth,
  isUser,
  paymentController.createPayment,
);
userRouter.post(
  "/verify-payment",
  isAuth,
  isUser,
  paymentController.verifyPayment,
);
userRouter.post("/review/:id", isAuth, isUser, reviewController.addReview);
userRouter.get("/service-details/:id", servicesController.serviceDetails);
userRouter.get(
  "/user-order-details/:id",
  isAuth,
  isUser,
  orderController.userOrderDetails,
);
userRouter.post("/check-location", locationController.checkLocation);

userRouter.get(
  "/user-address",
  isAuth,
  isUser,
  profileController.getUserAddress,
);
userRouter.post("/add-address", isAuth, isUser, profileController.addAddress);
userRouter.post(
  "/profile-photo-upload",
  isAuth,
  isUser,
  upload.single("photo"),
  userController.uploadPhoto,
);
userRouter.delete(
  "/profile-photo-remove",
  isAuth,
  isUser,
  userController.removePhoto,
);
userRouter.post(
  "/toggle-favorite/:serviceId",
  isAuth,
  isUser,
  favoriteController.toggleFavorite,
);
userRouter.get("/favorites", isAuth, isUser, favoriteController.getFavorites);
userRouter.delete(
  "/delete-address/:id",
  isAuth,
  isUser,
  profileController.deleteAddress,
);
userRouter.get("/my-reviews", isAuth, isUser, reviewController.myReviews);
userRouter.get("/home-reviews", reviewController.getHomeReviews);
module.exports = userRouter;
