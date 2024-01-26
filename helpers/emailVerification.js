const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  // port: 465,
  // secure: true,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_SECRET,
  },
});

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
