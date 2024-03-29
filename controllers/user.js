const { Op } = require("sequelize");
const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");
const { Profession } = require("../models/profession");
const { User, Profile } = require("../models/user");
const { WorkExperience } = require("../models/workExperience");
const { Education } = require("../models/education");
const { InterviewExperience } = require("../models/interviewExperience");
const { profileQueryOptions } = require("../helpers/queries/profile");
const { _getUsersLastMeeting } = require("./meeting");
const { profileCompletionStatus } = require("../helpers/user");

const getAllUserData = asyncWrapper(async (req, res) => {
  const userList = await User.findAll();
  res.success(userList);
});

const createUser = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const pf = await User.create(model);
  if (!pf) return res.fail("User data not created");

  res.success(pf);
});

const getAllUserProfiles = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const queryParameters = req.query;
  const userProfile = await Profile.findByPk(userId);
  const queryOptions = profileQueryOptions(queryParameters, userProfile);
  const today = new Date().getTime();
  const userList = await Profile.findAll({
    ...queryOptions,
    include: [
      {
        model: Availability,
        required: false,
        where: {
          dayHour: {
            [Op.gte]: today,
          },
        },
        order: [["availabilities", "dayHour", "ASC"]],
      },
      WorkExperience,
      InterviewExperience,
    ],
  });
  for (let user of userList) {
    const lastMeeting = await _getUsersLastMeeting(user.id);
    user.dataValues.lastMeeting = lastMeeting;
  }
  res.success(userList);
});

const getSingleUserProfile = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const today = new Date().getTime();
  if (!userId) return res.fail("Invalid user ID", BAD_REQUEST);

  const user = await Profile.findOne({
    where: { id: userId },
    include: [
      {
        model: Profession,
        as: "targetProfession",
        foreignKey: "targetProfessionId",
      },
      {
        model: WorkExperience,
      },
      Education,
      InterviewExperience,
      {
        model: Availability,
        required: false,
        where: {
          dayHour: {
            [Op.gte]: today,
          },
        },
      },
    ],
    order: [
      ["availabilities", "dayHourUTC", "ASC"],
      ["workExperiences", "startDate", "DESC"],
      ["education", "year_of_graduation", "DESC"],
    ],
  });

  if (!user) return res.fail("User data not found", NOT_FOUND);
  res.success(user);
});

const _updateUserProfile = async (res, userId, updatedFields) => {
  if (Object.keys(updatedFields).length === 0)
    return res.fail("No fields provided for update", BAD_REQUEST);

  const user = await Profile.findByPk(userId);
  if (!user) return res.fail("User data not found", NOT_FOUND);

  const updatedUser = await user.update(updatedFields);
  if (!updatedUser) return res.fail("User data update failed");

  return updatedUser;
};

const updateUserProfile = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.fail("Invalid user ID", BAD_REQUEST);
  let updatedUser = await _updateUserProfile(res, userId, req.body);
  if (updatedUser) {
    updatedUser.dataValues.completionStatus = await profileCompletionStatus(
      updatedUser.id
    );
    res.success(updatedUser);
  }
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.fail("Invalid user ID", BAD_REQUEST);
  await User.destroy({
    where: { id: userId },
  });
  res.success("User Deleted");
});

const deleteAllUser = asyncWrapper(async (req, res) => {
  await User.destroy({ where: {} });
  res.success("User table cleared");
});

const checkProperty = asyncWrapper(async (req, res) => {
  const obj = req.body;
  const found = await Profile.findOne({ where: obj });
  if (found) {
    return res.success({ exists: true });
  }
  res.success({ exists: false });
});

module.exports = {
  _updateUserProfile,
  getAllUserData,
  getAllUserProfiles,
  createUser,
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  deleteAllUser,
  checkProperty,
};
