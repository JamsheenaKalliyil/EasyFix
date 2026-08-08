const { Schema, default: mongoose } = require("mongoose");

const workSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    shift: {
      type: String,
      enum: ["morning", "afternoon", "evening"],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Services",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
      default: null,
    },
    status: {
      type: String,
      enum: ["Assigned", "Started", "Completed", "Cancelled"],
      default: "Assigned",
    },
  },
  {
    timestamps: true,
  },
);

const Work = mongoose.model("Work", workSchema);

module.exports = Work;
