const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");
const calculateOrderTotal = require("../controllers/calculateOrderTotal");
router.use(authController.authenticate);
router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.createOrder);
router
  .route("/:id")
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);
router
  .route("/calculateTotal/:id")
  .get(calculateOrderTotal.calculateTotalForOneOrder);

router
  .route("/calculateTotal")
  .get(calculateOrderTotal.calculateTotalForOneCustomer);

router
  .route("/calculateTotalForDay")
  .get(calculateOrderTotal.calculateTotalForDay);
module.exports = router;
