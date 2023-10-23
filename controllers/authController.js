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
    const user = await User.findById(decoded_token.id).select("-password");
    if (!user.isVerified) {
      throw new CustomError("Unauthenticated user", 401);
    }
    req.user = user;
  } else {
    throw new CustomError("Unauthenticated user", 401);
  }
  next();
});

exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, password } = req.body;
  if (!firstName || !lastName || !role || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }
  let user = await User.findOne({ email });
  if (user && user.isVerified) {
    throw new CustomError(
      "Account with this email already exists. Please SignIn",
      409
    );
  } else if (user && !user.isVerified) {
    sendOtp(email);
    res.status(201).json(user);
  } else if (!user && sendOtp(email)) {
    await User.create({
      firstName,
      lastName,
      role,
      email,
      password,
      isVerified: false,
      pointCashBack: 0,
    });
    res.status(201).json({
      firstName,
      lastName,
      role,
      email,
    });
  } else {
    throw new CustomError("failed to send OTP", 500);
  }
});

exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.isVerified && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    throw new CustomError("Invalid email or password", 409);
  }
});
