const { Router } = require("express");
const {
  getAllCompaniesOfInterest,
  createCompaniesOfInterest,
  getSingleCompaniesOfInterest,
  updateCompaniesOfInterest,
} = require("../controllers/companiesOfInterest");

const router = Router();

router
  .route("/:id")
  .get(getSingleCompaniesOfInterest)
  .put(updateCompaniesOfInterest);
router
  .route("/")
  .get(getAllCompaniesOfInterest)
  .post(createCompaniesOfInterest);

module.exports = router;
