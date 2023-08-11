const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  cuisine: { type: String },
  description: { type: String },
  spicinessLevel: { type: Number, min: 1, max: 3 },
  preparationTime: { type: Number, required: true },
  calories: { type: Number },
  sumOfRatings: { type: Number, default: 0 }, // 0.00001
  totalRatings: { type: Number, default: 0 },
  avgRating: { type: Number, default: 0 },
  reviews: [{ type: String, required: true }],
  availability: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

menuSchema.pre("save", function (next) {
  if (this.totalRatings === 0) {
    this.avgRating = 0;
  } else {
    this.avgRating = (this.sumOfRatings * 100000) / this.totalRatings;
  }
  next();
});

const MenuItem = mongoose.model("MenuItem", menuSchema);
module.exports = MenuItem;
