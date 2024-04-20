const { Router } = require("express");
const {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
  postCompanyData,
  deleteCompanyData,
  postExperienceLevelsData,
  postPreparationStagesData,
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
router.route("/companies").get(getAllCompanies).post(postCompanyData);
router.route("/companies/:id").delete(deleteCompanyData);

module.exports = router;
