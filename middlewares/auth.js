const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Error: ", err.message);
        throw Error("Incorrect token");
      } else {
        console.log("Decoded token: ", decoded);
        next();
      }
    });
  } else {
    res.send("You have to login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Error: ", err.message);
        res.locals.user = null;
        next();
      } else {
        console.log("Decoded token: ", decoded);
        const user = await User.findOne({ where: { id: decoded.id } });
        console.log("Current user: ", user);
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

module.exports = {
  requireAuth,
  checkUser,
};
