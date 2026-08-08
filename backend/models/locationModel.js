const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
    },
    pin: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
