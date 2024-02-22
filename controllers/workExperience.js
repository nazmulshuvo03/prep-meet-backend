const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { WorkExperience } = require("../models/workExperience");

const getAllWorkExp = asyncWrapper(async (req, res) => {
  const list = await WorkExperience.findAll();
  res.success(list);
});

const createWorkExp = asyncWrapper(async (req, res) => {
  // {user_id, profession_id, skills, company_name, start_date, end_data }
  const dataModel = req.body;
  const created = await WorkExperience.create(dataModel);
  if (!created) return res.fail("Work experience could not be added");
  res.success(created);
});

const getSingleWorkExp = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const file = await WorkExperience.findOne({ where: { id } });
  res.success(file);
});

const updateWorkExp = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);

  const found = await WorkExperience.findByPk(id);
  if (!found) res.fail("Data not found", NOT_FOUND);

  const updated = await found.update(updatedData);
  res.success(updated);
});

module.exports = {
  getAllWorkExp,
  createWorkExp,
  getSingleWorkExp,
  updateWorkExp,
};
