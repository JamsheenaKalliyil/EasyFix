const { Schema, default: mongoose } = require("mongoose");

const servicesSchema = new Schema(
  {
    servicename: {
      type: String,
      required: true,
      trim: true,

      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: String,
      default: "1 hour",
    },
  },
  {
    timestamps: true,
  },
);

const Services = mongoose.model("Services", servicesSchema);

module.exports = Services;
