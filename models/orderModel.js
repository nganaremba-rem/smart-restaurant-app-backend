const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  waiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menuItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
  ],
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
  tableNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed by waiter",
      "confirmed by chef",
      "order is ready",
      "payment done",
    ],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
