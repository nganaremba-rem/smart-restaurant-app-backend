const express = require("express");
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/signin", authController.signin);

module.exports = router;
