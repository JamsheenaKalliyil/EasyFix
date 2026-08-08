const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
    },

    transactions: [
      {
        type: {
          type: String,
          enum: ["Credit", "Debit"],
          required: true,
        },

        amount: {
          type: Number,
          required: true,
        },

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        staff: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Staff",
          default: null,
        },

        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
          default: null,
        },

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
