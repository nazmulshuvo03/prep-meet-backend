const { Router } = require("express");
const {
  getAllAvailabilityData,
  deleteAllAvailabilityData,
  getUserAvailability,
  createAvailabilityData,
  deleteAvailabilityData,
} = require("../controllers/availability");

const router = Router();

router.route("/").post(createAvailabilityData);
router.route("/:userId").get(getUserAvailability);
router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);

module.exports = router;
