const { Schema, default: mongoose } = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Services",
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
