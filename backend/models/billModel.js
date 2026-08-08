const { Schema, default: mongoose } = require("mongoose");

const billSchema = new Schema(
  {
    work: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Work",
      required: true,
      unique: true, // One bill per work
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },

    basicAmount: {
      type: Number,
      required: true,
    },

    extraHours: {
      type: Number,
      default: 0,
    },

    additionalCharges: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
    },
    
  },
  {
    timestamps: true,
  },
);

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
