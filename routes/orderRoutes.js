const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
router.use(authController.authenticate);
router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.createOrder);
router
  .route("/:id")
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);
module.exports = router;
