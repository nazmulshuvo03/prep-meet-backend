const { Router } = require("express");
const {
  getAllInterviewExperience,
  createInterviewExperience,
  getSingleInterviewExperience,
  updateInterviewExperience,
  deleteInterviewExp,
} = require("../controllers/interviewExperience");

const router = Router();

router
  .route("/:id")
  .get(getSingleInterviewExperience)
  .put(updateInterviewExperience)
  .delete(deleteInterviewExp);
router
  .route("/")
  .get(getAllInterviewExperience)
  .post(createInterviewExperience);

module.exports = router;
