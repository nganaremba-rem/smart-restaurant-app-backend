const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authController = require("../controllers/authController");
router.use(authController.authenticate);

router.route("/")
    .get(notificationController.getMyNotifications);
router.route("/:id")
    .delete(notificationController.deleteNotification);
module.exports = router;
