const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { TOKEN_COOKIE_NAME } = require("../controllers/auth");

const requireAuth = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Error: ", err.message);
        res.fail("Your autherization token is incorrect", 401);
      } else {
        // console.log("Decoded token: ", decoded);
        next();
      }
    });
  } else {
    res.fail("You are not authorized", 401);
  }
};

const adminOnly = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE_NAME];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log("Error: ", err.message);
        res.fail("Your autherization token is incorrect", 401);
      } else {
        console.log("Decoded token: ", decoded);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user.role === "ADMIN") {
          next();
        } else {
          res.fail("You are not an admin", 401);
        }
      }
    });
  } else {
    res.fail("You are not authorized", 401);
  }
};

module.exports = {
  requireAuth,
  adminOnly,
};
