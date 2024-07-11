const { Router } = require("express");
const {
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUserProfiles,
  getAllUserData,
  checkProperty,
  getProgress,
  switchEmailSubscription,
  getDashboardProfiles,
  updateUserLastVisit,
} = require("../controllers/user");

const workExperienceRoutes = require("./workExperience");
const educationRoutes = require("./education");
const interviewExperienceRoutes = require("./interviewExperience");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.route("/public/:userId").get(getSingleUserProfile);

router.use(requireAuth);
router.use("/workExperience", workExperienceRoutes);
router.use("/education", educationRoutes);
router.use("/interviewExperience", interviewExperienceRoutes);
router.route("/users").get(getAllUserData);
router.route("/progress").get(getProgress);
router.route("/check").post(checkProperty);
router.route("/all?").get(getAllUserProfiles);
router.route("/dashboard?").get(getDashboardProfiles);
router.route("/subscription").put(switchEmailSubscription);
router.route("/lastVisit").put(updateUserLastVisit);
router.route("/:userId").get(getSingleUserProfile).put(updateUserProfile).delete(deleteUser);

module.exports = router;
