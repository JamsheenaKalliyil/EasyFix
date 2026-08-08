const Favorite = require("../models/favoriteModel");

const favoriteController = {
  toggleFavorite: async (req, res) => {
    try {
      const { serviceId } = req.params;

      let favorite = await Favorite.findOne({
        user: req.user.id,
        service: serviceId,
      });

      // Remove favorite
      if (favorite) {
        await Favorite.findByIdAndDelete(favorite._id);

        return res.json({
          success: true,
          message: "Removed from favorites",
          status: "removed",
          serviceId,
        });
      }

      // Add favorite
      favorite = await Favorite.create({
        user: req.user.id,
        service: serviceId,
      });

      // Populate service details
      favorite = await Favorite.findById(favorite._id).populate("service");

      return res.json({
        success: true,
        message: "Added to favorites",
        status: "added",
        favorite,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
  getFavorites: async (req, res) => {
    try {
      const favorites = await Favorite.find({
        user: req.user.id,
      }).populate("service");

      res.json({
        success: true,
        favorites,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  },
};

module.exports = favoriteController;
