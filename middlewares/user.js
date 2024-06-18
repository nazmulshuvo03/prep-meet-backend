const jwt = require("jsonwebtoken");
const { Profile } = require("../models/user");
const { profileCompletionStatus } = require("../helpers/user");
const { TOKEN_COOKIE_NAME } = require("../constants/cookie");

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const checkUser = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Check user Error: ", err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await Profile.findOne({ where: { id: decoded.id } });
        // console.log("Current user: ", user);
        res.locals.user = user;
        res.cookie("user", JSON.stringify(user));
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

const checkProfileCompletion = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("Check profile completion Error: ", err.message);
      next();
    } else {
      // console.log("Decoded token: ", decoded);
      res.locals.completionStatus = await profileCompletionStatus(decoded.id);
      next();
    }
  });
};

module.exports = {
  decodeToken,
  checkUser,
  checkProfileCompletion,
};
