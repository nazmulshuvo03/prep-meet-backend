const { Router } = require("express");
const {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
  createCompany,
  postCompanyData,
  deleteCompanyData,
} = require("../controllers/static");

const router = Router();

router.route("/experienceLevels").get(getAllExperienceLevels);
router.route("/preparationStages").get(getAllPreparationStages);
router.route("/companies").get(getAllCompanies).post(createCompany);
router.route("/companies/all").post(postCompanyData);
router.route("/companies/:id").delete(deleteCompanyData);

module.exports = router;
