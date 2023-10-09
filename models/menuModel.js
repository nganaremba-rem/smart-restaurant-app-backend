const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  cuisine: { type: String },
  description: { type: String },
  spicinessLevel: { type: Number, min: 1, max: 3 },
  preparationTime: { type: Number },
  calories: { type: Number },
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  imageURL: { type: String },
});

const MenuItem = mongoose.model("MenuItem", menuSchema);
module.exports = MenuItem;
