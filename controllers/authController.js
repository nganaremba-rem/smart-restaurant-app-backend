const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const { sendOtp } = require("./otpController");
const CustomError = require("../customError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

exports.authenticate = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded_token.id).select("-password");
    next();
  }
  const error = new Error("Unauthenticated user");
  error.statusCode = 401;
  throw error;
});

exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;
  if (!firstName || !lastName || !role || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }
  let user = await User.findOne({ email });
  if (user) {
    throw new CustomError(
      "Account with this email already exists. Please SignIn",
      401
    );
  }
  if (sendOtp(email)) {
    res.status(201).json({
      // store in browser local storage with some mins expiry
      firstName,
      lastName,
      role,
      email,
      password,
    });
  } else {
    throw new Error("failed to send OTP", 500);
  }
});

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new CustomError("Invalid email or password", 409);
  }
});
