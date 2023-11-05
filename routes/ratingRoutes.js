const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const authController = require("../controllers/authController");

// router.route("/").post(ratingController.addMenuRating);
router.use(authController.authenticate);
router.route("/review").get(ratingController.getRating);
module.exports = router;
