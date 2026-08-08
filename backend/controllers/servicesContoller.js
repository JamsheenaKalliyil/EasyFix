const Review = require("../models/reviewModel");
const Services = require("../models/servicesModel");
const User = require("../models/userModel");

const servicesController = {
  addServices: async (req, res) => {
    try {
      const { servicename, description, price, duration } = req.body;

      const service = await Services.create({
        servicename,
        description,
        price,
        duration,

        image: req.file.path,
      });

      res.status(201).json({
        success: true,
        message: "Service added successfully",
        service,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  viewServices: async (req, res) => {
    try {
      const services = await Services.find();

      res.status(200).json({
        message: "view services success",
        services,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "inernal server error",
      });
    }
  },
  serviceDetails: async (req, res) => {
    try {
      const { id } = req.params;

      // Get service
      const service = await Services.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      // Get reviews of this service
      const reviews = await Review.find({ service: id })
        .populate("user", "name")
        .sort({ createdAt: -1 });

      // Get any 3 other services
      const moreServices = await Services.find({
        _id: { $ne: id },
      }).limit(4);

      res.status(200).json({
        success: true,
        service,
        reviews,
        moreServices,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  editService: async (req, res) => {
    try {
      const { id } = req.params;

      const { servicename, description, price, duration } = req.body;

      const service = await Services.findById(id);

      if (!service) {
        return res.status(404).json({
          message: "Service not found",
        });
      }

      service.servicename = servicename;
      service.description = description;
      service.price = price;
      service.duration = duration;

      // Update image only if a new one is uploaded
      if (req.file) {
        service.image = req.file.path;
      }

      await service.save();

      res.status(200).json({
        success: true,
        message: "Service updated successfully",
        service,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  removeService: async (req, res) => {
    try {
      await Services.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Service removed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = servicesController;
