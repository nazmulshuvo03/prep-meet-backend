const { Router } = require("express");
const {
  getAllAvailabilityData,
  deleteAllAvailabilityData,
  getUserAvailability,
  createAvailabilityData,
  deleteAvailabilityData,
  createRecurrentData,
  generateAvailabilityFromRecurrent,
  getRecurrentData,
  deleteRecurrentData,
} = require("../controllers/availability");

const router = Router();

router
  .route("/all")
  .get(getAllAvailabilityData)
  .delete(deleteAllAvailabilityData);
router.route("/user/:userId").get(getUserAvailability);
router.route("/:avaiabilityId").delete(deleteAvailabilityData);
router.route("/").post(createAvailabilityData);
router.route("/recurrent").post(createRecurrentData).get(getRecurrentData);
router.route("/recurrent/:recurrentId").delete(deleteRecurrentData);
router.route("/recurrent/generate").post(generateAvailabilityFromRecurrent);

module.exports = router;
