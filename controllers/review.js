const asyncWrapper = require("../middlewares/async");
const fs = require("fs");
const path = require("path");
const { Review, SelfAssessment } = require("../models/review");
const { _getSkillNameFromId } = require("./skill");
const { totalSelfAssessmentPoint } = require("../helpers/point");

const getAllReviewQuestions = asyncWrapper(async (req, res) => {
  const { skillId } = req.params;
  const skillName = await _getSkillNameFromId(skillId);

  const filePath = path.join(__dirname, `../stored/review/${skillName}.json`);
  const dataFile = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (dataFile) {
    return res.success(dataFile);
  } else {
    return res.fail("No data found");
  }
});

const getReview = asyncWrapper(async (req, res) => {
  const { meetingId, interviewerId } = req.params;
  const user = res.locals.user;
  if (!user) return res.fail("User not found or not logged in", 404);
  const data = await Review.findOne({
    where: {
      meetingId: meetingId,
      interviewerId: interviewerId,
      userId: user.id,
    },
  });
  if (!data) return res.fail("Data does not exist");
  res.success(data);
});

const createReview = asyncWrapper(async (req, res) => {
  const data = req.body;
  const user = res.locals.user;
  if (!user) return res.fail("User not found or not logged in", 404);
  data.userId = user.id;
  const exists = await Review.findOne({
    where: {
      meetingId: data.meetingId,
      interviewerId: data.interviewerId,
      userId: user.id,
    },
  });
  if (exists) {
    const updated = await exists.update(data);
    return res.success(updated);
  } else {
    const created = await Review.create(data);
    if (!created) return res.fail("Cound not create review");
    return res.success(created);
  }
});

const getSelfAssessment = asyncWrapper(async (req, res) => {
  const { meetingId, skillId } = req.params;
  const user = res.locals.user;
  if (!user) return res.fail("User not found or not logged in", 404);
  const data = await SelfAssessment.findOne({
    where: {
      meetingId,
      userId: user.id,
      skillId,
    },
  });
  if (!data) return res.fail("Data does not exist");
  res.success(data);
});

const createSelfAssessmewnt = asyncWrapper(async (req, res) => {
  const data = req.body;
  const user = res.locals.user;
  if (!user) return res.fail("User not found or not logged in", 404);
  data.userId = user.id;
  data.points = totalSelfAssessmentPoint(data.answerType1, data.answerType2);
  const exists = await SelfAssessment.findOne({
    where: {
      meetingId: data.meetingId,
      userId: user.id,
      skillId: data.skillId,
    },
  });
  if (exists) {
    const updated = await exists.update(data);
    return res.success(updated);
  } else {
    const created = await SelfAssessment.create(data);
    if (!created) return res.fail("Cound not create review");
    return res.success(created);
  }
});

module.exports = {
  getAllReviewQuestions,
  getReview,
  createReview,
  getSelfAssessment,
  createSelfAssessmewnt,
};
