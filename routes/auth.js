const { Router } = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  oauthCallback,
  resendEmailVerification,
  validateEmailVerification,
  googleAuth,
} = require("../controllers/auth");

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/google").post(googleAuth);
router.route("/logout").post(logoutUser);
router.route("/resendEmailVerification").post(resendEmailVerification);
router.route("/validateEmailVerification").post(validateEmailVerification);
router.route("/oauth/callback").get(oauthCallback);

module.exports = router;
