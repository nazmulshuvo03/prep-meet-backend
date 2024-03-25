const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { User, Profile } = require("../models/user");
const { sendVerificationEmail } = require("../helpers/emailVerification");
const { _updateUserProfile } = require("./user");
const {
  getAccessTokenFromAuth,
  getAccessTokenFromRefreshToken,
  redirectToOAuthURL,
} = require("../helpers/oAuth");
const { Profession } = require("../models/profession");
const { WorkExperience } = require("../models/workExperience");
const { Education } = require("../models/education");
const { InterviewExperience } = require("../models/interviewExperience");
const { Availability } = require("../models/availability");
const { generateUsername } = require("../helpers/string");
const { profileCompletionStatus } = require("../helpers/user");

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
  const today = new Date().getTime();
  const profile = await Profile.findOne({
    where: { id: userId },
    include: [
      {
        model: Profession,
        as: "targetProfession",
        foreignKey: "targetProfessionId",
      },
      {
        model: WorkExperience,
      },
      Education,
      InterviewExperience,
      {
        model: Availability,
        required: false,
        where: {
          dayHour: {
            [Op.gte]: today,
          },
        },
      },
    ],
    order: [
      ["availabilities", "dayHourUTC", "ASC"],
      ["workExperiences", "startDate", "DESC"],
      ["education", "year_of_graduation", "DESC"],
    ],
  });
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
  res.cookie(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
  const updatedProfile = await _updateUserProfile(res, user.id, {
    firstName,
    lastName,
    userName: generateUsername(),
    targetProfessionId,
  });
  if (updatedProfile) _handleLoginResponse(req, res, user.id);
});

const loginUser = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      const token = _createToken({ id: user.id });
      res.cookie(TOKEN_COOKIE_NAME, token, COOKIE_OPTIONS);
      _handleLoginResponse(req, res, user.id);
    } else {
      return res.fail("Incorrect password", 422);
    }
  } else {
    return res.fail("Email does not exist", 422);
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
    return res.success(data);
  } catch (err) {
    return res.fail(err.message);
  }
});

const meetAuth = asyncWrapper(async (req, res) => {
  const fs = require("fs");
  const filePath = "./token.json";
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // if no token file -> redirect to OAuth page to generate token file with access token
    if (err) {
      console.error("Error: File does not exist");
      redirectToOAuthURL();
    }
    // if there is a token file -> try to create meet

    // if create meeting fails -> try using refresh token to create new access token
    console.log("File exists");
  });
});

const oauthCallback = asyncWrapper(async (req, res) => {
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
  verifyEmail,
  oauthCallback,
};
