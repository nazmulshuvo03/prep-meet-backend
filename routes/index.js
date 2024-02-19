const { Router } = require("express");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const professionRoutes = require("./profession");
const availabilityRoutes = require("./availability");
const meetingRoutes = require("./meeting");
const fileRoutes = require("./file");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.route("/").get((req, res) => {
  res.json({
    message:
      "Hello from the Prep Meet backend. Last updated 20/02/2024 12:14 AM",
  });
});

router.use("/auth", authRoutes);
router.use("/file", fileRoutes);
router.use(requireAuth);
router.use("/user", userRoutes);
router.use("/profession", professionRoutes);
router.use("/availability", availabilityRoutes);
router.use("/meeting", meetingRoutes);

module.exports = router;
