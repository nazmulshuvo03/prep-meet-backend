const { Router } = require("express");
const {
  getAllReviewQuestions,
  getOrCreateReview,
  createSelfAssessmewnt,
  getSelfAssessment,
} = require("../controllers/review");

const router = Router();

router.route("/questions/:skillId").get(getAllReviewQuestions);
router.route("/interviewer").post(getOrCreateReview);
router
  .route("/self/:meetingId/:skillId")
  .get(getSelfAssessment)
  .post(createSelfAssessmewnt);

module.exports = router;
