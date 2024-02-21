const { Router } = require("express");
const {
  getAllSkills,
  createSkill,
  getSingleSkill,
  getAllExperienceTypes,
  createExperienceType,
  getSingleExperienceType
} = require("../controllers/skill");

const router = Router();

router.route("/experience-type/:id").get(getSingleExperienceType);
router.route("/experience-type/").get(getAllExperienceTypes).post(createExperienceType);

router.route("/:id").get(getSingleSkill);
router.route("/").get(getAllSkills).post(createSkill);

module.exports = router;
