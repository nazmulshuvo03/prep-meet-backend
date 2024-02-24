const { Router } = require("express");
const {
  getAllWorkExp,
  createWorkExp,
  getSingleWorkExp,
  updateWorkExp,
  deleteWorkExp,
} = require("../controllers/workExperience");

const router = Router();

router
  .route("/:id")
  .get(getSingleWorkExp)
  .put(updateWorkExp)
  .delete(deleteWorkExp);
router.route("/").get(getAllWorkExp).post(createWorkExp);

module.exports = router;
