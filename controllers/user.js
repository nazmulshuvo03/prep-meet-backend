const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/Availability");
const { Profession } = require("../models/profession");
const { User, Profile } = require("../models/user");

const getAllUserData = asyncWrapper(async (req, res) => {
  const userList = await User.findAll();
  res.send(userList);
});

const getAllUserProfiles = asyncWrapper(async (req, res) => {
  const userList = await Profile.findAll();
  res.send(userList);
});

const createUser = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const pf = await User.create(model);
  res.send(pf);
});

const getSingleUserProfile = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const user = await Profile.findOne({
    where: { id },
    include: [Profession, Availability],
  });
  res.send(user);
});

const updateUserData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const user = await User.findByPk(id);

  if (user) {
    const rowsAffected = await user.update(updatedFields);
    res.send(rowsAffected);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

const updateUserProfile = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const user = await Profile.findByPk(id);

  if (user) {
    const updatedUser = await user.update(updatedFields);
    res.send(updatedUser);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

const deleteUser = asyncWrapper(async (req, res) => {
  await User.destroy({
    where: { id: req.body.id },
  });
  res.send("User Deleted");
});

const deleteAllUser = asyncWrapper(async (req, res) => {
  await User.destroy({ where: {} });
  res.send("User table cleared");
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
