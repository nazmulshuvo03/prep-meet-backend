const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../middlewares/async");
const { User, Verification, Profile } = require("../models/user");
const { _updateUserProfile, _getUserProfile } = require("./user");
const {
  getAccessTokenFromAuth,
  redirectToOAuthURL,
} = require("../helpers/oAuth");
const { generateUsername } = require("../helpers/string");
const { profileCompletionStatus } = require("../helpers/user");
const {
  sendWelcomeEmail,
  sendVerificationEmail,
} = require("../helpers/emails");
const MIXPANEL_TRACK = require("../helpers/mixpanel");
const crypto = require("crypto");

const TOKEN_COOKIE_NAME = "prepMeetToken";
const MAX_AGE = 30 * 24 * 60 * 60;
const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: MAX_AGE * 1000,
  // domain: 'candidace.fyi', // for using same cookie in different application
};

const _createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: MAX_AGE,
  });
};

const _handleLoginResponse = async (req, res, userId) => {
  const profile = await _getUserProfile(userId);
  const completionStatus = await profileCompletionStatus(profile.dataValues.id);
  const contentType = req.headers["content-type"];
  if (contentType.startsWith("application/x-www-form-urlencoded")) {
    return res.redirect(
      `${process.env.DASHBOARD_URL}/profile/${profile.dataValues.id}`
    );
  } else {
    res.success({
      ...profile.dataValues,
      completionStatus,
    });
  }
};

const _createEmailVerification = async (userId, receiver) => {
  const token = crypto.randomBytes(32).toString("hex");
  const found = await Verification.findOne({
    where: { userId },
  });
  if (found) {
    found.update({ token });
  } else {
    await Verification.create({
      userId,
      token,
    });
  }
  await sendVerificationEmail({ token, receiver });
};

const signupUser = asyncWrapper(async (req, res) => {
  const { email, password, firstName, lastName, targetProfessionId } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    return res.fail("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const model = {
    email,
    password: hashedPassword,
  };
  const user = await User.create(model);
  const token = _createToken({ id: user.id });
  MIXPANEL_TRACK({
    name: "Signup",
    data: { email: user.email, type: user.type, targetProfessionId },
    id: user.id,
  });
  res.cookie(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
  const updatedProfile = await _updateUserProfile(res, user.id, {
    firstName,
    lastName,
    userName: generateUsername(),
    targetProfessionId,
  });
  if (updatedProfile) _handleLoginResponse(req, res, user.id);

  // let secondsPassed = 0;
  // let interval = setInterval(() => {
  //   secondsPassed++;
  //   console.log(`Seconds passed for: ${email}: ${secondsPassed}`);
  // }, 1 * 1000);

  setTimeout(() => {
    // clearInterval(interval);
    sendWelcomeEmail({
      name: "there",
      receiver: email,
    });
  }, 1 * 60 * 1000); // 1 minute
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = _createToken({ id: user.id });
      res.cookie(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
      MIXPANEL_TRACK({
        name: "Login",
        data: { email: user.email, type: user.type },
        id: user.id,
      });
      _handleLoginResponse(req, res, user.id);
    } else {
      return res.fail("Incorrect password", 422);
    }
  } else {
    return res.fail("Email does not exist", 422);
  }
});

const logoutUser = asyncWrapper(async (req, res) => {
  const { userId } = req.body;
  MIXPANEL_TRACK({
    name: "Logout",
    data: {},
    id: userId,
  });
  res.cookie(TOKEN_COOKIE_NAME, "", { maxAge: 1 });
  res.cookie("user", null, { maxAge: 1 });
  res.success("User logged out");
});

const resendEmailVerification = asyncWrapper(async (req, res) => {
  const user = await Profile.findOne({ where: { id: res.locals.user.id } });
  if (!user) return res.fail("User not found");
  await _createEmailVerification(user.id, user.email);
  res.success("Email sent");
});

const validateEmailVerification = asyncWrapper(async (req, res) => {
  const { userId, token } = req.body;
  if (userId !== res.locals.user.id) return res.fail("User does not match");
  const data = await Verification.findOne({ where: { userId } });
  if (data.dataValues.token === token) {
    return res.success("Email Verified");
  } else {
    return res.fail("Email verification failed");
  }
});

const oauthCallback = asyncWrapper(async (req, res) => {
  // this authorizationCode can be received from Google developer playground
  // by using the OAuth client ID and secret received in Google cloud console OAuth client
  // and this API should be used like this "/auth/oauth/callback?code=authorizationCode"
  const authorizationCode = req.query.code;
  if (authorizationCode) {
    getAccessTokenFromAuth(authorizationCode);
    // getAccessTokenFromRefreshToken();
    res.send("Authorization code received: " + authorizationCode);
  } else {
    res.status(400).send("Error: Authorization code not found");
  }
});

module.exports = {
  TOKEN_COOKIE_NAME,
  signupUser,
  loginUser,
  logoutUser,
  resendEmailVerification,
  validateEmailVerification,
  oauthCallback,
};
