const { Router } = require("express");
const {
  getAllReviewQuestions,
  getReview,
  createReview,
  createSelfAssessmewnt,
  getSelfAssessment,
} = require("../controllers/review");

const router = Router();

router.route("/questions/:skillId").get(getAllReviewQuestions);
router
  .route("/interviewer/:meetingId/:interviewerId")
  .get(getReview)
  .post(createReview);
router
  .route("/self/:meetingId/:skillId")
  .get(getSelfAssessment)
  .post(createSelfAssessmewnt);

module.exports = router;
