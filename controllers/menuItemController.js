const asyncHandler = require("express-async-handler");
const MenuItem = require("../models/menuModel");
const APIFeatures = require("./apiFeatures");
const CustomError = require("../customError");
exports.addMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    const newMenuItem = await MenuItem.create(req.body);
    if (!newMenuItem) {
      throw new CustomError("Failed to add this Item", 500);
    }
    res.status(201).json(newMenuItem);
  } else {
    throw new CustomError("You are not allowed to add menu items", 403);
  }
});

exports.getMenuItems = asyncHandler(async (req, res) => {
  const features = new APIFeatures(MenuItem.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let MenuItems = [];
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    MenuItems = await features.query.find();
    res.status(200).json(MenuItems);
  } else {
    MenuItems = await features.query.find({ availability: true });
    res.status(200).json(MenuItems);
  }
});

exports.deleteMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    const newMenuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!newMenuItem) {
      throw new CustomError("Failed to delete this Item", 500);
    }
    const message = "deleted " + newMenuItem.name + " from menu";
    res.status(204).json({
      message,
    });
  } else {
    throw new CustomError("You are not allowed to delete menu items.", 403);
  }
});

exports.updateMenuItem = asyncHandler(async (req, res) => {
  if (
    req.user &&
    (req.user.role == "manager" ||
      req.user.role == "admin" ||
      req.user.role == "owner")
  ) {
    if (req.body && req.body.averageRating && req.body.numberOfRatings) {
      throw new CustomError("you can't alter customer ratings", 405);
    }
    const newMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!newMenuItem) {
      throw new CustomError("Failed to update this Item", 500);
    }
    res.status(201).json(newMenuItem);
  } else {
    throw new CustomError("You are not allowed to update menu items.", 403);
  }
});

exports.menuName = asyncHandler(async (req, res) => {
  const id = req.params.id; // Get the 'menuId' from the route parameter

  // Use 'id' to fetch the menu name from the database
  try {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      throw new CustomError("Menu item not found", 404);
    }
    res.json({ menuName: menuItem.name });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});