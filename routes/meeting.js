const { Router } = require("express");
const {
  getAllMeetingData,
  getSingleMeetingData,
  createMeetingData,
  updateMeetingData,
  deleteSingleMeetingData,
  deleteAllMeetingData,
} = require("../controllers/meeting");

const router = Router();

router
  .route("/")
  .get(getSingleMeetingData)
  .post(createMeetingData)
  .put(updateMeetingData)
  .delete(deleteSingleMeetingData);
router.route("/all").get(getAllMeetingData).delete(deleteAllMeetingData);

module.exports = router;
