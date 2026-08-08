const Location = require("../models/locationModel");

const locationController = {
  checkLocation: async (req, res) => {
    try {
      const { pincode } = req.body;

      const location = await Location.findOne({ pin: pincode });

      if (location) {
        return res.json({
          available: true,
        });
      }

      res.json({
        available: false,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server Error",
      });
    }
  },
  addLocation: async (req, res) => {
    try {
      const { district, pincode } = req.body;

      const exists = await Location.findOne({ pin: pincode });

      if (exists) {
        return res.status(400).json({
          message: "Location already exists",
        });
      }

      const location = await Location.create({
        district,
        pin: pincode,
      });

      res.json({
        message: "location added successfully",
        location,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getLocations: async (req, res) => {
    try {
      const locations = await Location.find().sort({
        district: 1,
      });

      res.json(locations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteLocation: async (req, res) => {
    try {
      await Location.findByIdAndDelete(req.params.id);

      res.json({
        message: "Location deleted",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = locationController;
