const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");
const { Meeting } = require("../models/meeting");
const { Profession } = require("../models/profession");
const { User, Profile } = require("../models/user");

const getAllUserData = asyncWrapper(async (req, res) => {
  const userList = await User.findAll();
  res.success(userList);
});

const getAllUserProfiles = asyncWrapper(async (req, res) => {
  const userList = await Profile.findAll();
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

const getSingleUserProfile = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
  const user = await Profile.findOne({
    where: { id: userId },
    include: [
      Profession,
      Availability,
      { model: Meeting, as: "initiatedMeetings", foreignKey: "initiator" },
      { model: Meeting, as: "acceptedMeetings", foreignKey: "acceptor" },
    ],
  });
  if (!user) res.fail("User data not found", NOT_FOUND);

  res.success(user);
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
  getAllUserData,
  getAllUserProfiles,
  createUser,
  getSingleUserProfile,
  _updateUserProfile,
  updateUserProfile,
  deleteUser,
  deleteAllUser,
};
