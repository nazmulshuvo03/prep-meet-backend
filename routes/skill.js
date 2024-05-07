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
const { requireAuth } = require("../middlewares/auth");

const router = Router();

router.route("/").get(getAllSkills);
router.route("/experience-type/").get(getAllExperienceTypes);

router.use(requireAuth);
router
  .route("/experience-type/:id")
  .get(getSingleExperienceType)
  .delete(deleteExperienceType);
router.route("/experience-type/").post(createExperienceType);

router.route("/:id").get(getSingleSkill).delete(deleteSkill);
router.route("/").post(createSkill);

module.exports = router;
