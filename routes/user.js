const { Router } = require("express");
const {
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/user");

const router = Router();

router
  .route("/")
  .get(getSingleUser)
  .post(createUser)
  .put(updateUser)
  .delete(deleteUser);
router.route("/all").get(getAllUsers);

module.exports = router;
