const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const MIXPANEL_TRACK = require("../helpers/mixpanel");
const asyncWrapper = require("../middlewares/async");
const { InterviewExperience } = require("../models/interviewExperience");

const _ifUsersFirstInterviewExperience = async (userId) => {
  const data = await InterviewExperience.findOne({
    where: { user_id: userId },
  });
  return !!data;
};

const getAllInterviewExperience = asyncWrapper(async (req, res) => {
  const list = await InterviewExperience.findAll();
  res.success(list);
});

const createInterviewExperience = asyncWrapper(async (req, res) => {
  const model = req.body;

  const userHasIE = await _ifUsersFirstInterviewExperience(req.body.user_id);
  if (!userHasIE) {
    MIXPANEL_TRACK({
      name: "First Interview Experience Added",
      data: model,
      id: model.user_id,
    });
  }

  const created = await InterviewExperience.create(model);
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

const deleteInterviewExp = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await InterviewExperience.destroy({ where: { id } });
  res.success("Deleted");
});

module.exports = {
  getAllInterviewExperience,
  createInterviewExperience,
  getSingleInterviewExperience,
  updateInterviewExperience,
  deleteInterviewExp,
};
