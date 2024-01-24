const { Router } = require("express");
const {
  getSingleUserProfile,
  createUser,
  updateUserProfile,
  deleteUser,
  getAllUserProfiles,
  deleteAllUser,
  getAllUserData,
  updateUserData,
} = require("../controllers/user");
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router
  .route("/")
  .get(getSingleUserProfile)
  .post(createUser)
  .put(updateUserProfile)
  .delete(deleteUser);
router.route("/all").get(getAllUserProfiles).delete(deleteAllUser);
router.route("/users").get(requireAuth, getAllUserData).put(updateUserData);

module.exports = router;
