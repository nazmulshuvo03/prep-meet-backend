const express = require("express");
const router = express.Router();
const {
  getAllNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notification");

router.route("/:userId").get(getAllNotifications);
router.route("/").post(createNotification);
router.route("/:id").put(markNotificationAsRead).delete(deleteNotification);

module.exports = router;
