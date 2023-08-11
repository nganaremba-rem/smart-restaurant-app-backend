const express = require("express");
const menuItemController = require("../controllers/menuItemController");
const authController = require("../controllers/authController");
const router = express.Router();
router.use(authController.authenticate);
router
  .route("/")
  .get(menuItemController.getMenuItems)
  .post(menuItemController.addMenuItem)
  .delete(menuItemController.deleteMenuItem)
  .patch(menuItemController.updateMenuItem);
module.exports = router;
