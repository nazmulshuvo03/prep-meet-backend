const { Router } = require("express");
const {
  getAllReviewQuestions,
  getOrCreateReview,
} = require("../controllers/review");

const router = Router();

router.route("/questions/:skillId").get(getAllReviewQuestions);
router.route("/interviewer").post(getOrCreateReview);

module.exports = router;
