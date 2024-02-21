const { Op } = require('sequelize');
const asyncWrapper = require("../middlewares/async");
const { BAD_REQUEST } = require("../constants/errorCodes");
const { Skill, ExperienceType } = require("../models/skill");

/********************* Skills APIs *******************************/
const getAllSkills = asyncWrapper(async (_req, res) => {
  const skList = await Skill.findAll();
  res.success(skList);
})

const createSkill = asyncWrapper(async (req, res) => {
  const { name, profession_id } = req.body;
  if (!name) return res.fail("Skill name is not provided", BAD_REQUEST);
  if (!profession_id) return res.fail("Every skill belongs to one profession", BAD_REQUEST);
  const searchClause = {
    name: {
      [Op.iLike]: `%${name.toLowerCase().trim()}%`
    }
  }
  const found = await Skill.findOne({ where: searchClause })
  if (found) return res.success(found);
  const model = {
    name,
    profession_id
  }
  const sk = await Skill.create(model);
  if (!sk) return res.fail("Skill could not be created");
  res.success(sk);
})

const getSingleSkill = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const sk = await Skill.findByPk(id);
  res.success(sk);
})

const deleteSkill = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) res.fail("Invalid skill ID", BAD_REQUEST);
  await Skill.destroy({
    where: { id },
  });
  res.success("Skill Deleted");
})

/********************* Experience Types APIs *******************************/
const getAllExperienceTypes = asyncWrapper(async (_req, res) => {
  const skList = await ExperienceType.findAll();
  res.success(skList);
})

const createExperienceType = asyncWrapper(async (req, res) => {
  const { name, profession_id } = req.body;
  if (!name) return res.fail("Experience type name is not provided", BAD_REQUEST);
  if (!profession_id) return res.fail("Every Experience type belongs to one profession", BAD_REQUEST);
  const searchClause = {
    name: {
      [Op.iLike]: `%${name.toLowerCase().trim()}%`
    }
  }
  const found = await ExperienceType.findOne({ where: searchClause })
  if (found) return res.success(found);
  const model = {
    name,
    profession_id
  }
  const sk = await ExperienceType.create(model);
  if (!sk) return res.fail("Experience Type could not be created");
  res.success(sk);
})

const getSingleExperienceType = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const sk = await ExperienceType.findByPk(id);
  res.success(sk);
})

const deleteExperienceType = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) res.fail("Invalid experience type ID", BAD_REQUEST);
  await ExperienceType.destroy({
    where: { id },
  });
  res.success("Experience Type Deleted");
})

module.exports = {
  getAllSkills,
  createSkill,
  getSingleSkill,
  deleteSkill,
  getAllExperienceTypes,
  createExperienceType,
  getSingleExperienceType,
  deleteExperienceType
}
