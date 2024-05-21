const { Router } = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  oauthCallback,
  resendEmailVerification,
  validateEmailVerification,
  googleLogin,
  googleLoginCallback,
} = require("../controllers/auth");

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/resendEmailVerification").post(resendEmailVerification);
router.route("/validateEmailVerification").post(validateEmailVerification);
router.route("/oauth/callback").get(oauthCallback);

router.route("/google").get(googleLogin);
router.route("/google/callback").get(googleLoginCallback);

module.exports = router;
