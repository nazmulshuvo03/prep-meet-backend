const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

const sendMeetingEmail = async (meetingProps) => {
  const emailTemplatePath = path.join(
    process.cwd(),
    "./views/emails/meeting.ejs"
  );
  const templateContent = fs.readFileSync(emailTemplatePath, "utf8");
  const compiledTemplate = ejs.compile(templateContent);

  return compiledTemplate(meetingProps);
};

module.exports = {
  sendMeetingEmail,
};
