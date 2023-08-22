const ObjectId = require("mongoose").Types.ObjectId;
const Rating = require("../models/ratingModel");
const MenuItem = require("../models/menuModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
exports.addMenuRating = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "customer") {
    req.body.reviewer = req.user._id;
    req.body.menuId = req.params.id;
    const newMenuRating = await Rating.create(req.body);
    // console.log(1);
    updateMenuAverageRating(req.params.id); // Asynchronous call
    // console.log(2);
    if (!newMenuRating) {
      throw new Error("failed to add rating");
    }
    res.status(200).json(newMenuRating);
  } else {
    res.status(403).json({ error: "You don't have premission to give rating" });
  }
});

const updateMenuAverageRating = asyncHandler(async (menuId) => {
  let x = await getMenuRating(menuId);
  await MenuItem.findByIdAndUpdate(
    { _id: menuId },
    {
      averageRating: x["averageRating"],
      numberOfRatings: x["numberOfRatings"],
    }
  );
  // console.log(3);
});

const getMenuRating = asyncHandler(async (menuId) => {
  if (menuId) {
    const results = await Rating.aggregate([
      {
        $match: { menuId: new mongoose.Types.ObjectId(menuId) },
      },
      {
        $group: {
          _id: "$menuId",
          averageRating: { $avg: "$rating" },
          numberOfRatings: { $sum: 1 },
          reviews: {
            $push: {
              review: "$review",
            },
          },
        },
      },
      {
        $set: {
          averageRating: { $round: ["$averageRating", 1] }, // Round to 1 decimal place
        },
      },
    ]);
    if (results.length > 0) {
      return results[0];
    } else {
      return {
        averageRating: 0,
        numberOfRatings: 0,
      };
    }
  } else {
    throw new Error("Unauthorized access");
  }
});
