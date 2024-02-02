const crypto = require("crypto");
const transporter = require("./emailConfig");

const generateVerificationLink = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationLink = `http://your-app.com/verify?token=${verificationToken}`;
  return verificationLink;
};

const sendVerificationEmail = async () => {
  const mailOptions = {
    from: `Team PrepMeet <${process.env.EMAIL_SENDER}>`,
    to: "binarot758@grassdev.com",
    subject: "Verify Your Email",
    html: `<p>Click the following link to verify your email:</p>
             <a href="https://www.google.com">Verify Email</a>`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info.messageId;
};

module.exports = {
  sendVerificationEmail,
};
