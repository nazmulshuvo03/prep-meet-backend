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

const createReview = asyncWrapper(async (req, res) => {
  const data = req.body;
  const user = res.locals.user;
  if (!user) return res.fail("User not found or not logged in", 404);
  data.userId = user.id;
  const created = await Review.create(data);
  if (!created) return res.fail("Cound not create review");
  res.success(created);
});

module.exports = {
  getAllReviewQuestions,
  createReview,
};
