const { Router } = require("express");
const {
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUserProfiles,
  deleteAllUser,
  getAllUserData,
  checkProperty,
  getProgress,
} = require("../controllers/user");

const workExperienceRoutes = require("./workExperience");
const educationRoutes = require("./education");
const interviewExperienceRoutes = require("./interviewExperience");

const router = Router();

router.use("/workExperience", workExperienceRoutes);
router.use("/education", educationRoutes);
router.use("/interviewExperience", interviewExperienceRoutes);

router.route("/all/:userId?").get(getAllUserProfiles);
router.route("/users").get(getAllUserData);
router.route("/all").delete(deleteAllUser);
router.route("/progress").get(getProgress);
router.route("/check").post(checkProperty);
router
  .route("/:userId")
  .get(getSingleUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);

module.exports = router;
