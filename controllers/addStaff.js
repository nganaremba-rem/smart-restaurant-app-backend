const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const CustomError = require("../customError");

exports.addStaff = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;
  if (!firstName || !lastName || !role || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }
  let user = await User.findOne({ email });
  if (user) {
    throw new CustomError(
      "Account with this email already exists. Please SignIn",
      409
    );
  } else {
    await User.create({
      firstName,
      lastName,
      role,
      email,
      password,
      isVerified: true
    });
    res.status(201).json({
      firstName,
      lastName,
      role,
      email,
    });
  }
});
