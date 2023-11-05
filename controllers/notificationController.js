const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const CustomError = require("../customError");
const Notification = require("../models/notificationModel");
// Will be called from backend.
exports.createNotification = asyncHandler(async (body) => {
  await Notification.create(body);
});

// /api/v1/notifications/
exports.getMyNotifications = asyncHandler(async (req, res) => {
  let notifications;
  if (req.user.role === "waiter") {
    notifications = await Notification.find({
      $or: [{ receiver: req.user._id }, { group: "waiters" }],
    }).sort({ createdAt: 1 });
  } else if (req.user.role === "customer") {
    notifications = await Notification.find({ receiver: req.user._id }).sort({
      createdAt: 1,
    });
  } else if (req.user.role === "chef") {
    notifications = await Notification.find({
      $or: [{ receiver: req.user._id }, { group: "chefs" }],
    }).sort({ createdAt: 1 });
  }
  if (notifications && notifications.length !== 0) {
    res.status(200).send(notifications);
  } else {
    res.status(204).send([]);
  }
});

// /api/v1/notifications/:id
exports.deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.status(204);
});
