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

const sendVerificationEmail = async (props) => {
  const compiledTemplate = getCompiledFile("verification");

  const mailOptions = {
    from: `Team Candidace <${process.env.EMAIL_SENDER}>`,
    to: props.receiver,
    subject: "Email verification",
    html: compiledTemplate(props),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
};
