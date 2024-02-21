const { BAD_REQUEST } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { Profession } = require("../models/profession");
const { Skill, ExperienceType } = require("../models/skill");

const getAllProfessions = asyncWrapper(async (_req, res) => {
  const pfList = await Profession.findAll({
    include: [
      { model: Skill, as: "skills", foreignKey: "profession_id" },
      { model: ExperienceType, as: "experienceTypes", foreignKey: "profession_id" },
    ]
  });
  res.success(pfList);
});

const createProfession = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  if (!name) return res.fail("Profession name is not provided", BAD_REQUEST);
  const model = { name };
  const pf = await Profession.create(model);
  if (!pf) return res.fail("Profession could not be created");
  res.success(pf);
});

const getSingleProfession = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const prof = await Profession.findOne({
    where: { id },
    include: [
      { model: Skill, as: "skills", foreignKey: "profession_id" },
      { model: ExperienceType, as: "experienceTypes", foreignKey: "profession_id" },
    ]
  });
  if (!prof) res.fail("Profession data not found");
  res.success(prof);
});

const updateProfession = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  if (Object.keys(updatedFields).length === 0)
    return res.fail("No fields provided for update");

  const item = await Profession.findByPk(id);
  if (!item) res.fail("Profession data not found");

  const data = await item.update(updatedFields);
  if (!data) res.fail("Profession update failed");

  res.success(data);
});

const deleteProfession = asyncWrapper(async (req, res) => {
  await Profession.destroy({
    where: { id: req.params.id },
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
