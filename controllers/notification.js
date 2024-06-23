const asyncWrapper = require("../middlewares/async");
const { Notification } = require("../models/notification");
const { getIo, getSocketUsers } = require("../socket");

const getAllNotifications = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
  if (!notifications) {
    return res.fail("No notifications found for this user");
  }
  res.success(notifications);
});

const createNotification = asyncWrapper(async (req, res) => {
  const { userId, title, message } = req.body;
  const notification = await Notification.create({ userId, title, message });
  if (!notification) {
    return res.fail("Notification could not be created");
  }
  const io = getIo();
  const socketUsers = getSocketUsers();
  const socketId = socketUsers[userId];
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
  res.success(notification);
});

const markNotificationAsRead = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const [updated] = await Notification.update(
    { read: true },
    { where: { id } }
  );
  if (!updated) {
    return res.fail("Notification could not be marked as read");
  }
  res.success({ message: "Notification marked as read" });
});

const deleteNotification = asyncWrapper(async (req, res) => {
  const deleted = await Notification.destroy({ where: { id } });
  if (!deleted) {
    return res.fail("Notification could not be deleted");
  }
  res.success({ message: "Notification deleted" });
});

module.exports = {
  getAllNotifications,
  createNotification,
  markNotificationAsRead,
  deleteNotification,
};
