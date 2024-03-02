const { Router } = require("express");
const {
  getAllAvailabilityData,
  deleteAllAvailabilityData,
  getUserAvailability,
  createAvailabilityData,
  deleteAvailabilityData,
} = require("../controllers/availability");

const router = Router();

router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);
router.route("/:userId").get(getUserAvailability);
router.route("/:avaiabilityId").delete(deleteAvailabilityData);
router.route("/").post(createAvailabilityData);

module.exports = router;
