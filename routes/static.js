const { Router } = require("express");
const {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
  postCompanyData,
  deleteCompany,
  postExperienceLevelsData,
  postPreparationStagesData,
  createCompany,
} = require("../controllers/static");

const router = Router();

router
  .route("/experienceLevels")
  .get(getAllExperienceLevels)
  .post(postExperienceLevelsData);

router
  .route("/preparationStages")
  .get(getAllPreparationStages)
  .post(postPreparationStagesData);

router.route("/companies/single").post(createCompany);
router.route("/companies/:id").delete(deleteCompany);
router.route("/companies").get(getAllCompanies).post(postCompanyData);

module.exports = router;
