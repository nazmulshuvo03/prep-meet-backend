const { Router } = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  verifyEmail,
  oauthCallback,
} = require("../controllers/auth");

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/verifyEmail").post(verifyEmail);
router.route("/oauth/callback").get(oauthCallback);

module.exports = router;
