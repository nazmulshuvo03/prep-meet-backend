const { Router } = require("express");
const {
  getAllReviewQuestions,
  createReview,
} = require("../controllers/review");

const router = Router();

router.route("/questions/:skillId").get(getAllReviewQuestions);
router.route("/interviewer").post(createReview);

module.exports = router;
