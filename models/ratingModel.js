const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, default: 1, min: 1, max: 5 },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  review: { type: String },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
