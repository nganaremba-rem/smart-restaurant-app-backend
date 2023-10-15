const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
