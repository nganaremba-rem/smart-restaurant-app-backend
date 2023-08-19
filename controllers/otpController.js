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
  if (!email) {
    throw Error("Please provide email");
  }
  const min = 100000;
  const max = 999999;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  randomNumber = randomNumber.toString();
  const user = await OTP.findOne({ email });
  let otp = 0;
  const mailer = new Mailer(
    email,
    randomNumber,
    "Your OTP For Smart Restaurant is: "
  );
  mailer
    .sendEmail()
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
  if (user) {
    otp = await OTP.updateOne(
      { email },
      { code: randomNumber, createdAt: new Date() }
    );
  } else {
    otp = await OTP.create({ email, code: randomNumber });
  }
  if (!otp) {
    throw Error("Failed to generate OTP");
  }
});

exports.verifyOtp = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const enteredOTP = req.body.otp;
  if (!email) {
    throw Error("Please provide email");
  }
  const storedOtp = await OTP.findOne({ email });
  if (!storedOtp) {
    res.status(500).json({ message: "Something went" });
  }
  if (storedOtp.code == enteredOTP) {
    const newUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true, new: true }
    );
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      email: newUser.email,
      token: generateToken(newUser._id),
      isVerified: true,
    });
  } else {
    return false;
  }
});
