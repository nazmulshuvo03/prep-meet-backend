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
  const { id } = req.body;
  const user = await Profile.findOne({
    where: { id },
    include: [
      Profession,
      Availability,
      { model: Meeting, as: "initiatedMeetings", foreignKey: "initiator" },
      { model: Meeting, as: "acceptedMeetings", foreignKey: "acceptor" },
    ],
  });
  if (!user) res.fail("User data not found");

  res.success(user);
});

const updateUserData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update");

  const user = await User.findByPk(id);
  if (!user) res.fail("User data not found");

  const rowsAffected = await user.update(updatedFields);
  if (!rowsAffected) res.fail("User data update failed");

  res.success(rowsAffected);
});

const updateUserProfile = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update");

  const user = await Profile.findByPk(id);
  if (!user) res.fail("User data not found");

  const updatedUser = await user.update(updatedFields);
  if (!updatedUser) res.fail("User data update failed");

  res.success(updatedUser);
});

const deleteUser = asyncWrapper(async (req, res) => {
  await User.destroy({
    where: { id: req.body.id },
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
  updateUserData,
  updateUserProfile,
  deleteUser,
  deleteAllUser,
};
