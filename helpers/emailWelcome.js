const ejs = require("ejs");
const path = require("path");
const fs = require("fs");
const transporter = require("./emailConfig");

const sendWelcomeEmail = async (props) => {
  const emailTemplatePath = path.join(
    process.cwd(),
    "./views/emails/welcome.ejs"
  );
  const templateContent = fs.readFileSync(emailTemplatePath, "utf8");
  const compiledTemplate = ejs.compile(templateContent);

  const mailOptions = {
    from: `Team PrepMeet <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Welcome to Candidace",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
};
