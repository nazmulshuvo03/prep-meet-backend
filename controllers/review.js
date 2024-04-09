const asyncWrapper = require("../middlewares/async");
const fs = require("fs");
const path = require("path");

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

module.exports = {
  getAllReviewQuestions,
};
