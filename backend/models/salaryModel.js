const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate salary records for the same staff in the same month
salarySchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
