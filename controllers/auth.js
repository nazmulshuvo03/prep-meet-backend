const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncWrapper = require("../middlewares/async");
const { User, Verification, Profile } = require("../models/user");
const {
  _updateUserProfile,
  _getUserProfile,
  _checkIfUserUnsubscribed,
  _getUserType,
} = require("./user");
const { getAccessTokenFromAuth } = require("../helpers/oAuth");
const { generateUsername } = require("../helpers/string");
const {
  profileCompletionStatus,
  isProfileComplete,
} = require("../helpers/user");
const {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendProfileCompletionReminderEmail,
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
  const userType = await _getUserType(userId);
  const completionStatus = await profileCompletionStatus(profile.dataValues.id);
  res.success({
    ...profile.dataValues,
    ...userType.dataValues,
    completionStatus,
  });
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
  const { email, password, targetProfessionId, timezone } = req.body;
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
    userName: generateUsername(),
    targetProfessionId,
    timezone,
  });
  if (updatedProfile) _handleLoginResponse(req, res, user.id);

  await _createEmailVerification(user.id, user.email);

  setTimeout(() => {
    // clearInterval(interval);
    sendWelcomeEmail({
      name: "there",
      receiver: email,
    });
  }, 5 * 60 * 1000); // 5 minutes
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    if (!user.password)
      return res.fail("Authentication medium is not email and password");
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

const googleAuth = asyncWrapper(async (req, res) => {
  const {
    email,
    email_verified,
    family_name,
    given_name,
    picture,
    sub,
    timezone,
    targetProfessionId,
  } = req.body;
  const user = await Profile.findOne({ where: { email } });
  if (user) {
    if (user.authMedium === "GOOGLE") {
      const token = _createToken({ id: user.id });
      res.cookie(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
      MIXPANEL_TRACK({
        name: "Login",
        data: { email: user.email, type: user.type },
        id: user.id,
      });
      _handleLoginResponse(req, res, user.id);
    } else {
      return res.fail("Your authentication medium is not Google");
    }
  } else {
    if (!targetProfessionId)
      return res.fail({ ...req.body, message: "PROFESSION_REQUIRED" });
    const model = {
      email,
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
      userName: generateUsername(),
      email_verified,
      targetProfessionId,
      timezone,
      firstName: given_name,
      lastName: family_name,
      photoURL: picture,
      googleId: sub,
      authMedium: "GOOGLE",
    });
    if (updatedProfile) _handleLoginResponse(req, res, user.id);

    setTimeout(() => {
      sendWelcomeEmail({
        name: "there",
        receiver: email,
      });
    }, 5 * 60 * 1000);
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
  const user = await Profile.findByPk(userId);
  if (user && user.dataValues && !user.dataValues.email_verified) {
    const data = await Verification.findOne({ where: { userId } });
    if (data && data.dataValues.token === token) {
      user.update({ email_verified: true });
      data.destroy();
      return res.success("Email Verified");
    } else {
      return res.fail("Email verification failed");
    }
  }
});

const getAllVerificationToken = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  let list;
  if (userId) {
    list = await Verification.findOne({ where: { userId } });
  } else {
    list = await Verification.findAll();
  }
  res.success(list);
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

const sendAllUserProfileCompletionReminder = async () => {
  const users = await User.findAll();
  const today = new Date();

  for (let user of users) {
    const createdAt = new Date(user.createdAt);
    const createdAtWithoutTime = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const timeDifference = Math.abs(todayWithoutTime - createdAtWithoutTime);
    const daysSinceCreation = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (!(await isProfileComplete(user.id))) {
      if (!(await _checkIfUserUnsubscribed(user.id))) {
        if (daysSinceCreation === 2) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 1,
          });
        } else if (daysSinceCreation === 3) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 3,
          });
        } else if (daysSinceCreation === 5) {
          sendProfileCompletionReminderEmail({
            receiver: user.email,
            userId: user.id,
            day: 5,
          });
        }
      } else console.log(`Email ${user.email} unsubscribed`);
    }
  }
};

module.exports = {
  TOKEN_COOKIE_NAME,
  signupUser,
  loginUser,
  googleAuth,
  logoutUser,
  resendEmailVerification,
  validateEmailVerification,
  getAllVerificationToken,
  oauthCallback,
  sendAllUserProfileCompletionReminder,
};
