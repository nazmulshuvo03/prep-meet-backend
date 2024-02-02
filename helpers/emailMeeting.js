const transporter = require("./emailConfig");

const sendMeetingEmail = async (emailReceiver = "", meetingInfo = {}) => {
  const mailOptions = {
    from: `Team PrepMeet <${process.env.EMAIL_SENDER}>`,
    to: emailReceiver,
    subject: "New Meeting",
    html: `<p>You have a new meeting</p>
            <p>at ${new Date(parseInt(meetingInfo.dayHour))}</p>`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info.messageId;
};

module.exports = {
  sendMeetingEmail,
};
