const { Op } = require("sequelize");
const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
// const { Availability } = require("../models/availability");
const { Meeting } = require("../models/meeting");
const { Profession } = require("../models/profession");
const { User, Profile } = require("../models/user");
const { WorkExperience } = require("../models/workExperience");
const { Education } = require("../models/education");

const _getUserProfile = async (userId) => {
  return Profile.findByPk(userId);
};

const getAllUserData = asyncWrapper(async (req, res) => {
  const userList = await User.findAll();
  res.success(userList);
});

const createUser = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const pf = await User.create(model);
  if (!pf) res.fail("User data not created");

  res.success(pf);
});

const getAllUserProfiles = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const queryParameters = req.query;
  const queryOptions = {
    where: userId // user should not get profile in dashbaord
      ? {
          id: {
            [Op.ne]: userId,
          },
        }
      : {},
  };
  if (Object.keys(queryParameters).length) {
    Object.keys(queryParameters).forEach((param) => {
      const value = queryParameters[param];

      // Check if the value is a number
      if (!isNaN(value)) {
        // If it's a number, check if it's prefixed with "_lt" or "_gt" or "_lte" or "_gte"
        if (param.endsWith("_lt")) {
          queryOptions.where[param.slice(0, -3)] = {
            [Op.lt]: value,
          };
        } else if (param.endsWith("_gt")) {
          queryOptions.where[param.slice(0, -3)] = {
            [Op.gt]: value,
          };
        } else if (param.endsWith("_lte")) {
          queryOptions.where[param.slice(0, -4)] = {
            [Op.lte]: value,
          };
        } else if (param.endsWith("_gte")) {
          queryOptions.where[param.slice(0, -4)] = {
            [Op.gte]: value,
          };
        } else {
          queryOptions.where[param] = value;
        }
      } else {
        // If it's not a number, use equality
        queryOptions.where[param] = value;
      }
    });
  }
  const userList = await Profile.findAll(queryOptions);
  res.success(userList);
});

const getSingleUserProfile = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
  const user = await Profile.findOne({
    where: { id: userId },
    include: [
      Profession,
      // Availability,
      WorkExperience,
      Education,
      // { model: Meeting, as: "initiatedMeetings", foreignKey: "initiator" },
      // { model: Meeting, as: "acceptedMeetings", foreignKey: "acceptor" },
    ],
  });
  if (!user) res.fail("User data not found", NOT_FOUND);

  return res.success(user);
});

const _updateUserProfile = async (res, userId, updatedFields) => {
  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update", BAD_REQUEST);

  const user = await Profile.findByPk(userId);
  if (!user) res.fail("User data not found", NOT_FOUND);

  const updatedUser = await user.update(updatedFields);
  if (!updatedUser) res.fail("User data update failed");

  return updatedUser;
};

const updateUserProfile = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
  const updatedUser = await _updateUserProfile(res, userId, req.body);
  res.success(updatedUser);
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
  await User.destroy({
    where: { id: userId },
  });
  res.success("User Deleted");
});

const deleteAllUser = asyncWrapper(async (req, res) => {
  await User.destroy({ where: {} });
  res.success("User table cleared");
});

module.exports = {
  _getUserProfile,
  _updateUserProfile,
  getAllUserData,
  getAllUserProfiles,
  createUser,
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  deleteAllUser,
};
