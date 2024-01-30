const { Router } = require("express");
const {
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUserProfiles,
  deleteAllUser,
  getAllUserData,
} = require("../controllers/user");

const router = Router();

router
  .route("/:userId")
  .get(getSingleUserProfile)
  .put(updateUserProfile)
  .delete(deleteUser);
router.route("/all").get(getAllUserProfiles).delete(deleteAllUser);
router.route("/users").get(getAllUserData);

module.exports = router;
