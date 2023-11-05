const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const CustomError = require("../customError");

// GET  /api/v1/orders/calculateTotal/:id
exports.calculateTotalForOneOrder = asyncHandler(async (req, res) => {
  const totalAmount = await calculateTotalFromOrderId(req.params.id);
  if (totalAmount == 0) {
    throw new CustomError("order with the given id not found", 404);
  } else {
    res.status(200).json({ totalAmount });
  }
});

// GET /api/v1/orders/calculateTotal
exports.calculateTotalForOneCustomer = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const orders = await Order.find({
    user: customerId,
    status: { $ne: "paid" },
  });
  if (!orders) {
    throw new CustomError("Order for this user not found", 404);
  } else {
    let totalAmount = 0;
    for (let i = 0; i < orders.length; i++) {
      totalAmount += await calculateTotalFromOrderId(orders[i]._id);
    }
    if (totalAmount == 0) {
      throw new CustomError("order with the given id not found", 404);
    } else {
      res.status(200).json({ totalAmount });
    }
  }
});

// helper function
calculateTotalFromOrderId = asyncHandler(async (id) => {
  const orderId = id;
  const orderTotal = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $unwind: "$menuItems",
    },
    {
      $lookup: {
        from: "menuitems", // Name of the MenuItem collection
        localField: "menuItems.menuName",
        foreignField: "_id",
        as: "menuItemDetails",
      },
    },
    {
      $unwind: "$menuItemDetails",
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $multiply: ["$menuItemDetails.price", "$menuItems.quantity"],
          },
        },
      },
    },
  ]);

  if (!orderTotal || orderTotal.length == 0) {
    return 0;
  } else {
    return orderTotal[0].totalAmount;
  }
});

exports.calculateTotalForDay = asyncHandler(async (req, res) => {
  const currentdate = new Date();
  const startOfDay = new Date(currentdate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(currentdate);
  endOfDay.setUTCHours(23, 59, 99, 999);

  const orders = await Order.find({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
    status: "paid",
  });

  let totalMoney = 10;

  for (let i = 0; i < orders.length; i++) {
    totalMoney += orders[i].totalAmount;
  }

  res
    .status(200)
    .json({
      amount: totalMoney,
      startdate: startOfDay,
      enddate: endOfDay,
      list: orders,
    });
});