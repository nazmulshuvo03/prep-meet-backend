const asyncWrapper = require("../middlewares/async");
const fs = require("fs");
const path = require("path");
const { Review } = require("../models/review");

const getAllReviewQuestions = asyncWrapper(async (req, res) => {
  const { skillId } = req.params;

  const filePath = path.join(__dirname, `../stored/review/${skillId}.json`);
  const dataFile = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (dataFile) {
    return res.success(dataFile);
  } else {
    return res.fail("No data found");
  }
});

const getOrCreateReview = asyncWrapper(async (req, res) => {
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
    if (
      (data.punctuality !== 0 && exists.punctuality !== data.punctuality) ||
      (data.preparedness !== 0 && exists.preparedness !== data.preparedness) ||
      (data.depthOfFeedback !== 0 &&
        exists.depthOfFeedback !== data.depthOfFeedback) ||
      (data.comments !== "" && exists.comments !== data.comments)
    ) {
      const updated = await exists.update(data);
      return res.success(updated);
    } else {
      return res.success(exists);
    }
  } else {
    const created = await Review.create(data);
    if (!created) return res.fail("Cound not create review");
    return res.success(created);
  }
});

module.exports = {
  getAllReviewQuestions,
  getOrCreateReview,
};
