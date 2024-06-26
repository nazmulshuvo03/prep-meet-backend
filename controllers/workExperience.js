const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const MIXPANEL_TRACK = require("../helpers/mixpanel");
const { profileCompletionStatus } = require("../helpers/user");
const asyncWrapper = require("../middlewares/async");
const { WorkExperience } = require("../models/workExperience");

const _getUserCurrentCompany = async (userId) => {
  const data = await WorkExperience.findOne({
    where: { user_id: userId, currentCompany: true },
  });
  return data;
};

const _ifUsersFirstWorkExperience = async (userId) => {
  const data = await WorkExperience.findOne({
    where: { user_id: userId },
  });
  return !!data;
};

const getAllWorkExp = asyncWrapper(async (req, res) => {
  const list = await WorkExperience.findAll();
  res.success(list);
});

const createWorkExp = asyncWrapper(async (req, res) => {
  const model = {
    user_id: req.body.user_id,
    jobTitle: req.body.jobTitle,
    experienceId: req.body.experienceId,
    skills: req.body.skills,
    companyId: req.body.companyId,
    country: req.body.country,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  if (!model.jobTitle) return res.fail("Job Role is not provided", BAD_REQUEST);
  if (!model.experienceId)
    return res.fail("Experience Level is not provided", BAD_REQUEST);
  if (!model.companyId)
    return res.fail("Company name is not provided", BAD_REQUEST);
  if (!model.startDate) return res.fail("Start date is not provided");

  if (!model.endDate) {
    const existingCurrentCompany = await _getUserCurrentCompany(model.user_id);
    if (existingCurrentCompany)
      return res.fail("You already have a current company");
    model.currentCompany = true;
  }

  const userHasWE = await _ifUsersFirstWorkExperience(req.body.user_id);
  if (!userHasWE) {
    MIXPANEL_TRACK({
      name: "First Work Experience Added",
      data: model,
      id: model.user_id,
    });
  }

  const created = await WorkExperience.create(model);
  if (!created) return res.fail("Work experience could not be added");
  created.dataValues.completionStatus = await profileCompletionStatus(
    created.user_id
  );
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

  if (updatedData.endDate && !found.endDate) {
    // this means user left existing current company
    updatedData.currentCompany = false;
  }

  if (!updatedData.endDate && found.endDate) {
    // if someone wants to remove end date and make that one current company
    const existingCurrentCompany = await _getUserCurrentCompany(
      updatedData.user_id
    );
    if (existingCurrentCompany)
      return res.fail("You already have a current company");
    updatedData.currentCompany = true;
  }

  const updated = await found.update(updatedData);
  res.success(updated);
});

const deleteWorkExp = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const found = await WorkExperience.findOne({ where: { id } });
  found.destroy();
  const completionStatus = await profileCompletionStatus(found.user_id);
  res.success(completionStatus);
});

module.exports = {
  _getUserCurrentCompany,
  getAllWorkExp,
  createWorkExp,
  getSingleWorkExp,
  updateWorkExp,
  deleteWorkExp,
};
