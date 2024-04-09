const { Router } = require("express");
const { getAllReviewQuestions } = require("../controllers/review");

const router = Router();

router.route("/questions/:skillId").get(getAllReviewQuestions);

module.exports = router;
