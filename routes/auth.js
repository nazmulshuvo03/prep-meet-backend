const { Router } = require("express");
const { signupUser, loginUser, logoutUser } = require("../controllers/auth");

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

module.exports = router;
