const { Message } = require("../models/message");
const { Profile } = require("../models/user");
const asyncWrapper = require("../middlewares/async");
const { NOT_FOUND, BAD_REQUEST } = require("../constants/errorCodes");
const { Op } = require("sequelize");

exports.sendMessage = asyncWrapper(async (req, res) => {
  const { senderId, receiverId, subject, body } = req.body;
  if (!senderId || !receiverId || !body)
    return res.fail("Invalid input data", BAD_REQUEST);

  const message = await Message.create({ senderId, receiverId, subject, body });
  res.success(message);
});

exports.getInbox = asyncWrapper(async (req, res) => {
  const userId = res.locals.user.id;

  // Find all messages where the current user is the receiver, grouped by sender
  const messages = await Message.findAll({
    where: { receiverId: userId },
    include: [{ model: Profile, as: "sender" }],
    order: [
      ["isRead", "ASC"], // Unread messages first
      ["createdAt", "DESC"], // Latest message first
    ],
  });

  // Group messages by sender and only keep the latest one
  const uniqueMessages = [];
  const seenSenders = new Set();

  messages.forEach((message) => {
    if (!seenSenders.has(message.senderId)) {
      uniqueMessages.push(message);
      seenSenders.add(message.senderId);
    }
  });

  if (!uniqueMessages.length) return res.fail("No messages found", NOT_FOUND);
  res.success(uniqueMessages);
});

exports.getSentMessages = asyncWrapper(async (req, res) => {
  const userId = res.locals.user.id;

  // Find all messages where the current user is the sender, grouped by receiver
  const messages = await Message.findAll({
    where: { senderId: userId },
    include: [{ model: Profile, as: "receiver" }],
    order: [
      ["isRead", "ASC"], // Unread messages first
      ["createdAt", "DESC"], // Latest message first
    ],
  });

  // Group messages by receiver and only keep the latest one
  const uniqueMessages = [];
  const seenReceivers = new Set();

  messages.forEach((message) => {
    if (!seenReceivers.has(message.receiverId)) {
      uniqueMessages.push(message);
      seenReceivers.add(message.receiverId);
    }
  });

  if (!uniqueMessages.length) return res.fail("No messages found", NOT_FOUND);
  res.success(uniqueMessages);
});

exports.getChatbox = asyncWrapper(async (req, res) => {
  const userId = res.locals.user.id;
  const { otherUserId } = req.params;

  if (!otherUserId) return res.fail("Invalid user ID", BAD_REQUEST);

  // Find all messages between the current user and the other user
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    include: [
      { model: Profile, as: "sender" },
      { model: Profile, as: "receiver" },
    ],
    order: [["createdAt", "ASC"]], // Oldest messages first
  });

  if (!messages.length) return res.fail("No messages found", NOT_FOUND);
  res.success(messages);
});

exports.getMessageById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("Invalid message ID", BAD_REQUEST);

  const message = await Message.findByPk(id, {
    include: [
      { model: Profile, as: "sender" },
      { model: Profile, as: "receiver" },
    ],
  });
  if (!message) return res.fail("Message not found", NOT_FOUND);
  res.success(message);
});

exports.markMessagesAsRead = asyncWrapper(async (req, res) => {
  const userId = res.locals.user.id;
  const { otherUserId } = req.body;
  if (!userId || !otherUserId)
    return res.fail("Invalid input data", BAD_REQUEST);

  await Message.update(
    { isRead: true },
    {
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
    }
  );
  res.success("Messages marked as read");
});

exports.deleteMessage = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("Invalid message ID", BAD_REQUEST);

  const message = await Message.findByPk(id);
  if (!message) return res.fail("Message not found", NOT_FOUND);

  await message.destroy();
  res.success("Message deleted successfully");
});
