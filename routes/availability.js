const { Router } = require("express");
const {
  getAllAvailabilityData,
  createOrUpdateAvailabilityData,
  deleteUserAvailability,
  deleteAllAvailabilityData,
  getUserAvailability,
} = require("../controllers/availability");

const router = Router();

router
  .route("/:userId")
  .get(getUserAvailability)
  .post(createOrUpdateAvailabilityData)
  .delete(deleteUserAvailability);
router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);

module.exports = router;
