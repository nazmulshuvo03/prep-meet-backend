const { Router } = require("express");
const {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
  createCompany,
} = require("../controllers/static");

const router = Router();

router.route("/experienceLevels").get(getAllExperienceLevels);
router.route("/preparationStages").get(getAllPreparationStages);
router.route("/companies").get(getAllCompanies).post(createCompany);

module.exports = router;
