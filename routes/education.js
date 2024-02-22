const { Router } = require("express");
const {
  getAllEducation,
  createEducation,
  getSingleEducation,
  updateEducation,
} = require("../controllers/education");

const router = Router();

router.route("/:id").get(getSingleEducation).put(updateEducation);
router.route("/").get(getAllEducation).post(createEducation);

module.exports = router;
