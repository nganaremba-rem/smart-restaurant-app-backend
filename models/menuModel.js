const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  cuisine: { type: String, default: "other" },
  description: { type: String },
  spicinessLevel: { type: Number, min: 0, max: 3, default: 0 },
  preparationTime: { type: Number },
  calories: { type: Number },
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  averageRating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  imageURL: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3272/3272764.png",
  },
});

const MenuItem = mongoose.model("MenuItem", menuSchema);
module.exports = MenuItem;
