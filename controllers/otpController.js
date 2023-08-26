const OTP = require("../models/otpModel");
const User = require("../models/userModel");
const Mailer = require("../mailer");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

exports.sendOtp = asyncHandler(async (email) => {
  const min = 100000;
  const max = 999999;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  randomNumber = randomNumber.toString();
  const message =
    randomNumber.toString() +
    " is the OTP to login to you Smart Restaurant App account. Do not disclose it to anyone.";
  const mailer = new Mailer(email, message, "Smart Restaurant App");
  mailer
    .sendEmail()
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
  await OTP.create({
    email,
    code: randomNumber,
    createdAt: new Date(),
  });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const { firstName, lastName, role, email, password, enteredOTP } = req.body;
  if (!email || !enteredOTP || !password || !lastName || !firstName || !role) {
    throw new Error("");
  }
  const arr = await OTP.find({ email }).sort({ createdAt: -1 });
  const storedOtp = arr[0];
  if (!storedOtp) {
    throw new Error("Something went wrong");
  }
  if (storedOtp.code == enteredOTP) {
    const newUser = await User.create({
      firstName,
      lastName,
      role,
      email,
      password,
    });
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    const error = new Error("Incorrect OTP");
    error.statusCode = 400;
    throw error;
  }
});
