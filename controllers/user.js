const asyncWrapper = require("../middlewares/async");
const { User } = require("../models/user");

const getAllUsers = asyncWrapper(async (req, res) => {
  const userList = await User.findAll();
  res.send(userList);
});

const createUser = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const model = {
    name,
  };
  const pf = await User.create(model);
  res.send(pf);
});

const getSingleUser = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const user = await User.findOne({
    where: { id },
  });
  res.send(user);
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const [rowsAffected] = await User.update(updatedFields, {
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

module.exports = {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
