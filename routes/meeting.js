const { Router } = require("express");
const {
  getAllMeetingData,
  getSingleMeetingData,
  createMeetingData,
  updateMeetingData,
  deleteSingleMeetingData,
  deleteAllMeetingData,
  getUsersMeetingData,
  cancelMeeting,
} = require("../controllers/meeting");

const router = Router();

router
  .route("/")
  .post(createMeetingData)
  .put(updateMeetingData)
  .delete(deleteSingleMeetingData);
router.route("/user/:userId").get(getUsersMeetingData);
router.route("/:id").get(getSingleMeetingData);
router.route("/cancel").post(cancelMeeting);
router.route("/all").get(getAllMeetingData).delete(deleteAllMeetingData);

module.exports = router;
