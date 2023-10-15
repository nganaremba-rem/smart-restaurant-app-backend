const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  waiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  menuItems: [
    {
      menuName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  tableNumber: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed_by_waiter",
      "confirmed_by_chef",
      "order_is_ready",
      "payment_done",
    ],
    default: "pending",
  },
  isRated: { type: Boolean, default: false },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
