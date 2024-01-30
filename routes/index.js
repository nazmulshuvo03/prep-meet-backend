const { Router } = require("express");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const professionRoutes = require("./profession");
const availabilityRoutes = require("./availability");
const meetingRoutes = require("./meeting");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.route("/").get((req, res) => {
  res.json({ message: "Hello from the Prep Meet backend!!!" });
});

router.use("/auth", authRoutes);
// router.use(requireAuth);
router.use("/user", userRoutes);
router.use("/profession", professionRoutes);
router.use("/availability", availabilityRoutes);
router.use("/meeting", meetingRoutes);

module.exports = router;
