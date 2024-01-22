const asyncWrapper = require("../middlewares/async");
const { User, Profile } = require("../models/user");

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
  });
  res.send(user);
});

const updateUserProfile = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const [rowsAffected] = await Profile.update(updatedFields, {
    where: { id },
  });

  if (rowsAffected === 1) {
    res.send({ message: "User updated successfully" });
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
  getAllUserProfiles,
  createUser,
  getSingleUserProfile,
  updateUserProfile,
  deleteUser,
  deleteAllUser,
};
