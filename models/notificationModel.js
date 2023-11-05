const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  message: { type: String, required: true },
  group: {
    type: String,
    enum: [
      "waiters",
      "chefs",
    ],
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
