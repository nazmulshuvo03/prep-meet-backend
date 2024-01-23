const { Router } = require("express");
const userRoutes = require("./user");
const professionRoutes = require("./profession");
const availabilityRoutes = require("./availability");
const meetingRoutes = require("./meeting");

const router = Router();

router.route("/").get((req, res) => {
  res.json({ message: "Hello from the Prep Meet backend!!!" });
});

router.use("/user", userRoutes);
router.use("/profession", professionRoutes);
router.use("/availability", availabilityRoutes);
router.use("/meeting", meetingRoutes);

module.exports = router;
