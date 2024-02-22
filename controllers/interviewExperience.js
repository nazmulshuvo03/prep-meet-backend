const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { InterviewExperience } = require("../models/interviewExperience");

const getAllInterviewExperience = asyncWrapper(async (req, res) => {
  const list = await InterviewExperience.findAll();
  res.success(list);
});

const createInterviewExperience = asyncWrapper(async (req, res) => {
  const dataModel = req.body;
  const created = await InterviewExperience.create(dataModel);
  if (!created) return res.fail("Interview Experience could not be added");
  res.success(created);
});

const getSingleInterviewExperience = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const file = await InterviewExperience.findOne({ where: { id } });
  res.success(file);
});

const updateInterviewExperience = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);

  const found = await InterviewExperience.findByPk(id);
  if (!found) res.fail("Data not found", NOT_FOUND);

  const updated = await found.update(updatedData);
  res.success(updated);
});

module.exports = {
  getAllInterviewExperience,
  createInterviewExperience,
  getSingleInterviewExperience,
  updateInterviewExperience,
};
