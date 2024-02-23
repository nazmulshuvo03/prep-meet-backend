const { Router } = require("express");
const {
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUserProfiles,
  deleteAllUser,
  getAllUserData,
} = require("../controllers/user");

const workExperienceRoutes = require("./workExperience");
const educationRoutes = require("./education");
const companiesOfInterestRoutes = require("./companiesOfInterest");
const interviewExperienceRoutes = require("./interviewExperience");

const router = Router();

router.use("/workExperience", workExperienceRoutes);
router.use("/education", educationRoutes);
router.use("/companiesOfInterest", companiesOfInterestRoutes);
router.use("/interviewExperience", interviewExperienceRoutes);

router.route("/all/:userId?").get(getAllUserProfiles);
router.route("/users").get(getAllUserData);
router.route("/all").delete(deleteAllUser);
router
  .route("/:userId")
  .get(getSingleUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);

module.exports = router;
