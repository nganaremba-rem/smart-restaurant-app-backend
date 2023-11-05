const ObjectId = require("mongoose").Types.ObjectId;
const Rating = require("../models/ratingModel");
const MenuItem = require("../models/menuModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const CustomError = require("../customError");
exports.addMenuRating = asyncHandler(async (req, res) => {
  if (req.user && req.user.role == "customer") {
    req.body.reviewer = req.user._id;
    req.body.menuId = req.params.id;
    const newMenuRating = await Rating.create(req.body);
    updateMenuAverageRating(req.params.id); // Asynchronous call

    if (!newMenuRating) {
      throw new CustomError("failed to add rating", 500);
    }
    res.status(200).json({ message: "Thanks for your feedback" });
  } else {
    throw new CustomError("You don't have premission to give rating", 403);
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
    throw new CustomError("Please provide menu ID", 400);
  }
});

exports.getRating = asyncHandler(async (req, res) => {
  //Check if the user's role is "manager" or "admin"
  if (
    req.user &&
    (req.user.role === "manager" ||
      req.user.role === "admin" ||
      req.user.role === "owner")
  ) {
    const rating = await Rating.find();
    res.status(200).json(rating);
  } else {
    //If the user's role is not "manager" or "admin," return a 403 Forbidden status.
    res.status(403).json({ message: "Unauthorized access" });
  }
});