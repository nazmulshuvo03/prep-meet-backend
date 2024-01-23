const { Router } = require("express");
const {
  getAllAvailabilityData,
  getSingleAvailabilityData,
  createAvailabilityData,
  updateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteAllAvailabilityData,
} = require("../controllers/availability");

const router = Router();

router
  .route("/")
  .get(getSingleAvailabilityData)
  .post(createAvailabilityData)
  .put(updateAvailabilityData)
  .delete(deleteSingleAvailabilityData);
router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);

module.exports = router;
