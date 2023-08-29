const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
router.route("/").post(ratingController.addMenuRating);
module.exports = router;
