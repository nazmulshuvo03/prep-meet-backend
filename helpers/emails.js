const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const transporter = require("./emailConfig");

const getCompiledFile = (fileName = "empty") => {
  const emailTemplatePath = path.join(
    process.cwd(),
    `./views/emails/${fileName}.ejs`
  );
  const templateContent = fs.readFileSync(emailTemplatePath, "utf8");
  const compiledTemplate = ejs.compile(templateContent);
  return compiledTemplate;
};

const getMeetingEmailTemplate = (meetingProps) => {
  const compiledTemplate = getCompiledFile("meeting");
  return compiledTemplate(meetingProps);
};

const sendWelcomeEmail = async (props) => {
  const compiledTemplate = getCompiledFile("welcome");

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Congratulations on starting your interview prep journey!",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

const sendMeetingEmail = async (props) => {
  const template = getMeetingEmailTemplate(props);

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Test Meeting Email!",
    html: template,
  };

  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (props) => {
  const compiledTemplate = getCompiledFile("verification");

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Verify Candidace Email",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

const sendProfileCompletionReminderEmail = async (props) => {
  const compiledTemplate = getCompiledFile(`profile_reminder_day${props.day}`);

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Reminder from Candidace",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

const sendReactivationReminderEmail = async (props) => {
  const compiledTemplate = getCompiledFile("reactivation");

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Reminder from Candidace",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

const sendForgetPasswordEmail = async (props) => {
  const compiledTemplate = getCompiledFile("forget_password");

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Reset your Candidace Password",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  getMeetingEmailTemplate,
  sendWelcomeEmail,
  sendMeetingEmail,
  sendVerificationEmail,
  sendProfileCompletionReminderEmail,
  sendReactivationReminderEmail,
  sendForgetPasswordEmail,
};
