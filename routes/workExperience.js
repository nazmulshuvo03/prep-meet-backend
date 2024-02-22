const { Router } = require("express");
const {
  getAllWorkExp,
  createWorkExp,
  getSingleWorkExp,
  updateWorkExp,
} = require("../controllers/workExperience");

const router = Router();

router.route("/:id").get(getSingleWorkExp).put(updateWorkExp);
router.route("/").get(getAllWorkExp).post(createWorkExp);

module.exports = router;
