const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const asyncWrapper = require("../middlewares/async");
const { User } = require("../models/user");
const { sendVerificationEmail } = require("../helpers/emailVerification");
const { _updateUserProfile } = require("./user");

const TOKEN_COOKIE_NAME = "prepMeetToken";
const MAX_AGE = 30 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
};

const signupUser = asyncWrapper(async (req, res) => {
  console.log("header: ", req.headers["content-type"]);
  const { email, password, firstName, lastName } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    res.fail("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const model = {
    email,
    password: hashedPassword,
  };
  const user = await User.create(model);
  const token = createToken(user.id);
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: MAX_AGE * 1000,
  });
  const updatedProfile = await _updateUserProfile({
    id: user.id,
    firstName,
    lastName,
  });
  const contentType = req.headers["content-type"];
  if (contentType.startsWith("application/json")) {
    res.success({ ...updatedProfile.dataValues });
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    res.redirect(`${process.env.DASHBOARD_URL}/dashboard`);
  } else {
    res.success({ ...updatedProfile.dataValues });
  }
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = createToken(user.id);
      res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: MAX_AGE * 1000,
      });
      res.success({ userId: user.id });
    } else {
      res.fail("Incorrect password");
    }
  } else {
    res.fail("Incorrect email");
  }
});

const logoutUser = asyncWrapper(async (req, res) => {
  res.cookie(TOKEN_COOKIE_NAME, "", { maxAge: 1 });
  res.cookie("user", null, { maxAge: 1 });
  res.success("User logged out");
});

const verifyEmail = asyncWrapper(async (req, res) => {
  try {
    const data = await sendVerificationEmail();
    res.success(data);
  } catch (err) {
    res.fail(err.message);
  }
});

module.exports = {
  TOKEN_COOKIE_NAME,
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail,
};
