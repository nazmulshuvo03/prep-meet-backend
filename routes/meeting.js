const { Router } = require("express");
const {
  getAllMeetingData,
  getSingleMeetingData,
  createMeetingData,
  updateMeetingData,
  deleteSingleMeetingData,
  deleteAllMeetingData,
  getUsersMeetingData,
} = require("../controllers/meeting");

const router = Router();

router
  .route("/")
  .get(getSingleMeetingData)
  .post(createMeetingData)
  .put(updateMeetingData)
  .delete(deleteSingleMeetingData);
router.route("/:userId").get(getUsersMeetingData);
router.route("/all").get(getAllMeetingData).delete(deleteAllMeetingData);

module.exports = router;
