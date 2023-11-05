const express = require("express");
const menuItemController = require("../controllers/menuItemController");
const authController = require("../controllers/authController");
const ratingController = require("../controllers/ratingController");
const router = express.Router();
router.use(authController.authenticate);
router
  .route("/")
  .get(menuItemController.getMenuItems)
  .post(menuItemController.addMenuItem);

router
  .route("/:id")
  .delete(menuItemController.deleteMenuItem)
  .get(menuItemController.menuName)
  .patch(menuItemController.updateMenuItem);
router.route("/rating/:id").post(ratingController.addMenuRating);
module.exports = router;
