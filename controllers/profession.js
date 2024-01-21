const asyncWrapper = require("../middlewares/async");
const { Profession } = require("../models/profession");

const getAllProfessions = asyncWrapper(async (req, res) => {
  const pfList = await Profession.findAll();
  res.send(pfList);
});

const createProfession = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const model = {
    name,
  };
  const pf = await Profession.create(model);
  res.send(pf);
});

const getSingleProfession = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const prof = await Profession.findOne({
    where: { id },
  });
  res.send(prof);
});

const updateProfession = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const [rowsAffected] = await Profession.update(updatedFields, {
    where: { id },
  });

  if (rowsAffected === 1) {
    res.send({ message: "Profession updated successfully" });
  } else {
    res.status(404).send({ message: "Profession not found" });
  }
});

const deleteProfession = asyncWrapper(async (req, res) => {
  await Profession.destroy({
    where: { id: req.body.id },
  });
  res.send("Deleted");
});

module.exports = {
  getAllProfessions,
  createProfession,
  getSingleProfession,
  updateProfession,
  deleteProfession,
};
