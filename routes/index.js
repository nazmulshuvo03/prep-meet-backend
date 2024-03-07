const { Router } = require("express");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const professionRoutes = require("./profession");
const skillRoutes = require("./skill");
const availabilityRoutes = require("./availability");
const meetingRoutes = require("./meeting");
const staticRoutes = require("./static");
const fileRoutes = require("./file");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.route("/").get((_req, res) => {
  res.json({
    message:
      "Hello from the Prep Meet backend. Last updated 08/03/2024 01:40 AM",
  });
});

router.use("/auth", authRoutes);
router.use("/file", fileRoutes);
router.use("/profession", professionRoutes);
router.use(requireAuth);
router.use("/user", userRoutes);
router.use("/skill", skillRoutes);
router.use("/availability", availabilityRoutes);
router.use("/meeting", meetingRoutes);
router.use("/static", staticRoutes);

module.exports = router;
