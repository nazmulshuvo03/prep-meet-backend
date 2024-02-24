const { Router } = require("express");
const {
  getAllEducation,
  createEducation,
  getSingleEducation,
  updateEducation,
  deleteEducation,
} = require("../controllers/education");

const router = Router();

router
  .route("/:id")
  .get(getSingleEducation)
  .put(updateEducation)
  .delete(deleteEducation);
router.route("/").get(getAllEducation).post(createEducation);

module.exports = router;
