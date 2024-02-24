const { Router } = require("express");
const {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
} = require("../controllers/static");

const router = Router();

router.route("/experienceLevels").get(getAllExperienceLevels);
router.route("/preparationStages").get(getAllPreparationStages);
router.route("/companies").get(getAllCompanies);

module.exports = router;
