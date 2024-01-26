const asyncWrapper = require("../middlewares/async");
const { Profession } = require("../models/profession");

const getAllProfessions = asyncWrapper(async (req, res) => {
  const pfList = await Profession.findAll();
  res.success(pfList);
});

const createProfession = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const model = { name };
  const pf = await Profession.create(model);
  res.success(pf);
});

const getSingleProfession = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const prof = await Profession.findOne({
    where: { id },
  });

  if (!prof) res.fail("Profession data not found");
  res.success(prof);
});

const updateProfession = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update");

  const item = await Profession.findByPk(id);
  if (!item) res.fail("Profession data not found");

  const data = await item.update(updatedFields);
  if (!data) res.fail("Profession update failed");

  res.success(data);
});

const deleteProfession = asyncWrapper(async (req, res) => {
  await Profession.destroy({
    where: { id: req.body.id },
  });
  res.success("Profession Deleted");
});

const deleteAllProfession = asyncWrapper(async (req, res) => {
  await Profession.destroy({ where: {} });
  res.success("Profession table cleared");
});

module.exports = {
  getAllProfessions,
  createProfession,
  getSingleProfession,
  updateProfession,
  deleteProfession,
  deleteAllProfession,
};
