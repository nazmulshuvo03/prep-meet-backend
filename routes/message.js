const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getInbox,
  getSentMessages,
  getMessageById,
  deleteMessage,
  getChatbox,
  markMessagesAsRead,
  getAllMessages,
} = require("../controllers/message");

router.route("/").post(sendMessage);
router.route("/inbox").get(getInbox);
router.route("/sent").get(getSentMessages);
router.route("/all").get(getAllMessages);
router.route("/chat/:otherUserId").get(getChatbox);
router.route("/:id").get(getMessageById).delete(deleteMessage);
router.route("/markAsRead").put(markMessagesAsRead);

module.exports = router;
