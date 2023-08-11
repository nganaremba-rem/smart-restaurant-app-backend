const asyncHandler = require("express-async-handler");
const MenuItem = require("../models/menuModel");
const APIFeatures = require("./apiFeatures");

exports.addMenuItem = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "manager") {
    const newMenuItem = await MenuItem.create(req.body);
    if (!newMenuItem) {
      throw new Error("Failed to add this Item");
    }
    res.status(201).json(newMenuItem);
  } else {
    res
      .status(403)
      .json({ error: "You are not authorized to add menu items." });
  }
});

exports.getMenuItems = asyncHandler(async (req, res) => {
  const features = new APIFeatures(MenuItem.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let MenuItems = "";
  if (req.user == "customer") {
    MenuItems = await features.query.find({ availability: true });
  } else {
    MenuItems = await features.query.find();
  }
  if (!MenuItems) {
    throw new Error("Failed to get Menu Items");
  }
  res.status(200).json(MenuItems);
});

exports.deleteMenuItem = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "manager") {
    const newMenuItem = await MenuItem.findByIdAndDelete(req.body._id);
    if (!newMenuItem) {
      throw new Error("Failed to delete this Item");
    }
    res.status(201).json(newMenuItem);
  } else {
    res
      .status(403)
      .json({ error: "You are not authorized to delete menu items." });
  }
});

exports.updateMenuItem = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "manager") {
    const newMenuItem = await MenuItem.findById(req.body._id);
    if (req.body.sumOfRatings || req.body.totalRatings || req.body.avgRating) {
      throw new Error("You can't alter customer ratings");
    }
    if (!newMenuItem) {
      throw new Error("Failed to update this Item");
    }
    newMenuItem.set(req.body);
    await newMenuItem.save();
    res.status(201).json(newMenuItem);
  } else if (req.user && req.user.role == "customer") {
    const newMenuItem = await MenuItem.findById(req.body._id);
    if (!newMenuItem) {
      throw new Error("Failed to add rating");
    }
    if (req.body.rating && req.body.rating <= 0.00005) {
      const currentSumOfRatings = newMenuItem.sumOfRatings;
      const currentNoOfRatings = newMenuItem.totalRatings;
      newMenuItem.set({
        sumOfRatings: currentSumOfRatings + req.body.rating,
        totalRatings: currentNoOfRatings + 1,
      });
      await newMenuItem.save();
      res.status(201).json(newMenuItem);
    } else {
      throw new Error("You cant update this attribute of item");
    }
  }
});
