const Rating = require("../models/ratingModel");
const asyncHandler = require("express-async-handler");

exports.addMenuRating = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "customer") {
    req.body.reviewer = req.user._id;
    req.body.menuId = req.params.id;
    const newMenuRating = await Rating.create(req.body);
    if (!newMenuRating) {
      throw new Error("failed to add rating");
    }
    res.status(200).json(newMenuRating);
  } else {
    res.status(403).json({ error: "You don't have premission to give rating" });
  }
});
