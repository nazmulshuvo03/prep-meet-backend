const asyncWrapper = require("../middlewares/async");
const {
  ExperienceLevel,
  PreparationStage,
  Companies,
} = require("../models/static");

const getAllExperienceLevels = asyncWrapper(async (req, res) => {
  const data = await ExperienceLevel.findAll();
  res.success(data);
});

const getAllPreparationStages = asyncWrapper(async (req, res) => {
  const data = await PreparationStage.findAll();
  res.success(data);
});

const getAllCompanies = asyncWrapper(async (req, res) => {
  const data = await Companies.findAll();
  res.success(data);
});

module.exports = {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
};
