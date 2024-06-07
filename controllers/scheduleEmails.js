const {
  sendProfileCompletionReminderEmail,
  sendReactivationReminderEmail,
} = require("../helpers/emails");
const { isProfileComplete } = require("../helpers/user");
const { User, Profile } = require("../models/user");
const { _checkIfUserUnsubscribed } = require("./user");

const sendAllUserProfileCompletionReminder = async () => {
  const users = await User.findAll();
  const today = new Date();

  for (let user of users) {
    const createdAt = new Date(user.createdAt);
    const createdAtWithoutTime = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const timeDifference = Math.abs(todayWithoutTime - createdAtWithoutTime);
    const daysSinceCreation = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (!(await isProfileComplete(user.id))) {
      if (!(await _checkIfUserUnsubscribed(user.id))) {
        if (daysSinceCreation === 2) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 1,
          });
        } else if (daysSinceCreation === 3) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 3,
          });
        } else if (daysSinceCreation === 5) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 5,
          });
        }
      } else console.log(`Email ${user.email} unsubscribed`);
    }
  }
};

const sendAllUserReactivationReminder = async () => {
  const users = await Profile.findAll();
  const today = new Date();

  for (let user of users) {
    if (user.lastVisit) {
      const lastVisit = new Date(user.lastVisit);
      const visitedBeforeInHour = (today - lastVisit) / (60 * 60 * 1000);
      if (visitedBeforeInHour > 2) {
        sendReactivationReminderEmail({
          receiver: user.email,
          userId: user.id,
        });
      }
    }
  }
};

module.exports = {
  sendAllUserProfileCompletionReminder,
  sendAllUserReactivationReminder,
};
