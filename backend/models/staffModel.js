const { Schema, default: mongoose } = require("mongoose");

const staffSchema = new Schema(
  {
    // Login Account (Reference to User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    works: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Work",
      },
    ],

    // Personal Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    place: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      
    },
    dob: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    education: {
      type: String,
      required: true,
      trim: true,
    },

    // Job Details
    jobRole: {
      type: String,
      required: true,
      trim: true,

      lowercase: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    // Bank Details
    bankName: {
      type: String,
      required: true,
      trim: true,
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
      required: true,
    },

    // Agreement
    agreementAccepted: {
      type: Boolean,
      default: false,
    },

    // Status
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  },
);

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;
