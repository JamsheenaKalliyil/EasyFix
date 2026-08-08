const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db/connectDB");
connectDB();

const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const listEndpoints = require("express-list-endpoints");
const adminRouter = require("./routes/adminRoutes");

const path = require("path");
const staffRouter = require("./routes/staffRoutes");
const errorHandler = require("./middlewares/errorHandler");
app.use(express.json());

app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://easy-fix-ten.vercel.app",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(cookieParser());
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/staff", staffRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
