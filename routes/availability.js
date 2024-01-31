const { Router } = require("express");
const {
  getAllAvailabilityData,
  createOrUpdateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteAllAvailabilityData,
} = require("../controllers/availability");

const router = Router();

router
  .route("/")
  .post(createOrUpdateAvailabilityData)
  .delete(deleteSingleAvailabilityData);
router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);

module.exports = router;
