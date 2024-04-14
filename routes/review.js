const { Router } = require("express");
const {
  getAllReviewQuestions,
  getReview,
  createReview,
  createSelfAssessmewnt,
  getSelfAssessment,
  getUserReviews,
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
router.route("/:userId").get(getUserReviews);

module.exports = router;
