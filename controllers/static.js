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

const createCompany = asyncWrapper(async (req, res) => {
  const model = {
    name: req.body.name,
    country: req.body.country,
  };
  const created = await Companies.create(model);
  res.success(created);
});

module.exports = {
  getAllExperienceLevels,
  getAllPreparationStages,
  getAllCompanies,
  createCompany,
};
