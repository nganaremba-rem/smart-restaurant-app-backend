const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");

// Add this function to get all users' data
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});
