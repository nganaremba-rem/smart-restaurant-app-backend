const OTP = require("../models/otpModel");
const User = require("../models/userModel");
const Mailer = require("../mailer");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const CustomError = require("../customError");

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
  const { email, enteredOTP } = req.body;
  if (!email || email.length === 0 || !enteredOTP === 0) {
    throw new CustomError("Please enter OTP and email", 400);
  }
  const arr = await OTP.find({ email }).sort({ createdAt: -1 });
  const storedOtp = arr[0];
  if (!storedOtp) {
    throw new CustomError("Something went wrong");
  }
  if (storedOtp.code == enteredOTP) {
    const newUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      email: newUser.email,
      isVerified: newUser.isVerified,
      token: generateToken(newUser._id),
    });
  } else {
    throw new CustomError("incorrect OTP", 400);
  }
});
