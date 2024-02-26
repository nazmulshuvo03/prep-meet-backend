const { Router } = require("express");
const {
  getAllSkills,
  createSkill,
  getSingleSkill,
  deleteSkill,
} = require("../controllers/skill");

const {
  getAllExperienceTypes,
  createExperienceType,
  getSingleExperienceType,
  deleteExperienceType,
} = require("../controllers/experienceTypes");

const router = Router();

router
  .route("/experience-type/:id")
  .get(getSingleExperienceType)
  .delete(deleteExperienceType);
router
  .route("/experience-type/")
  .get(getAllExperienceTypes)
  .post(createExperienceType);

router.route("/:id").get(getSingleSkill).delete(deleteSkill);
router.route("/").get(getAllSkills).post(createSkill);

module.exports = router;
