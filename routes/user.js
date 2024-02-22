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

const router = Router();

router.use("/workExperience", workExperienceRoutes);

router
  .route("/:userId")
  .get(getSingleUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);
router.route("/all/:userId?").get(getAllUserProfiles);
router.route("/all").delete(deleteAllUser);
router.route("/users").get(getAllUserData);

module.exports = router;
