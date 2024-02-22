const { Router } = require("express");
const {
  getAllInterviewExperience,
  createInterviewExperience,
  getSingleInterviewExperience,
  updateInterviewExperience,
} = require("../controllers/interviewExperience");

const router = Router();

router
  .route("/:id")
  .get(getSingleInterviewExperience)
  .put(updateInterviewExperience);
router
  .route("/")
  .get(getAllInterviewExperience)
  .post(createInterviewExperience);

module.exports = router;
