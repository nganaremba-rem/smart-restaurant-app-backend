const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Order = require("./../models/orderModel");
const MenuItem = require("../models/menuModel");
const APIFeatures = require("../controllers/apiFeatures");

// api/v1/orders/
exports.createOrder = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "customer") {
    req.body.user = req.user._id;
    const newOrder = await Order.create(req.body);
    // WRITE CODE TO CALCULATE TOTAL AMOUNT FOR THIS ORDER (Maybe)
    if (!newOrder) {
      throw new Error("Failed to add this Item");
    }
    res.status(201).json(newOrder);
  } else {
    res.status(403).json({ error: "You are not allowed to place order" });
  }
});

// api/v1/orders/:id
exports.updateOrder = asyncHandler(async (req, res) => {
  const currentOrder = await Order.findById(req.params.id);
  if (!currentOrder) {
    throw new Error("Order not found");
  }
  if (req.body.totalAmount) {
    throw new Error("You can't set order total amount");
  }

  // customer can update his order if it is in pending state
  if (req.user && req.user.role == "customer") {
    // ensuring if customer who created this order is updating and waiter hasn't confirmed it yet
    if (currentOrder.status == "pending" && currentOrder.user == req.user._id) {
      req.body.status = "pending";
      currentOrder.set(req.body);
      await currentOrder.save();
      res.status(201).json(currentOrder);
    }
    throw new Error("You can't change the order now");
  }

  // waiter will go to that table number and click on confirm button
  else if (req.user && req.user.role == "waiter") {
    if (currentOrder.status == "confirmed by waiter") {
      throw new Error("Other waiter has picked up this order");
    }
    req.body.waiter = req.user._id;
    req.body.status = "confirmed by waiter";
    currentOrder.set(req.body);
    await currentOrder.save();
    res.status(201).json(currentOrder);
  }

  // master chef will click on preparation started button
  // You should pass status key in the body for calling this API
  else if (req.user && req.user.role == "chef") {
    if (currentOrder.status == "confirmed by waiter") {
      throw new Error("Other chef has started the preparation");
    }
    req.body.chef = req.user._id;
    // req.body.status can be "confirmed by chef" OR "order is ready"
    currentOrder.set(req.body);
    await currentOrder.save();
    res.status(201).json(currentOrder);
  } else {
    throw new Error("You are not allowed to update this order");
  }
});
