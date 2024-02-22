const { Router } = require("express");
const {
  getAllWorkExp,
  createWokrExp,
  getSingleWorkExp,
  updateWorkExp,
} = require("../controllers/workExperience");

const router = Router();

router.route("/:id").get(getSingleWorkExp).put(updateWorkExp);
router.route("/").get(getAllWorkExp).post(createWokrExp);

module.exports = router;
