const {
  sendWelcomeEmail,
  sendMeetingEmail,
  sendVerificationEmail,
  sendProfileCompletionReminderEmail,
  sendReactivationReminderEmail,
} = require("../helpers/emails");
const asyncWrapper = require("../middlewares/async");

const testEmail = asyncWrapper(async (req, res) => {
  const { type } = req.params;
  const props = req.body;
  props.fileName = type;

  if (type === "welcome") {
    // props: { name, receiver }
    sendWelcomeEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else if (type === "meeting") {
    // props: { meetingLink, initiatorUserName, initiatorUserId, acceptorUserName, acceptorUserId  }
    sendMeetingEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else if (type === "verification") {
    // props: { receiver, token }
    sendVerificationEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else if (type === "profile_reminder") {
    // props: { receiver, userId, day }
    sendProfileCompletionReminderEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else if (type === "profile_reactivation") {
    // props: { receiver, userId }
    sendReactivationReminderEmail(props);
    res.success(`Email sent to ${props.receiver}`);
  } else res.fail("Email type is not provided");
});

module.exports = {
  testEmail,
};
