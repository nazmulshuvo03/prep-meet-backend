const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { BAD_REQUEST } = require("../constants/errorCodes");
const { Skill } = require("../models/skill");

const _getSkillsOfProfession = async (profession_id) => {
  const data = await Skill.findAll({ where: { profession_id } });
  return data;
};

const getAllSkills = asyncWrapper(async (_req, res) => {
  const skList = await Skill.findAll();
  res.success(skList);
});

const createSkill = asyncWrapper(async (req, res) => {
  const { name, profession_id } = req.body;
  if (!name) return res.fail("Skill name is not provided", BAD_REQUEST);
  if (!profession_id)
    return res.fail("Every skill belongs to one profession", BAD_REQUEST);
  const searchClause = {
    name: {
      [Op.iLike]: `%${name.toLowerCase().trim()}%`,
    },
  };
  const found = await Skill.findOne({ where: searchClause });
  if (found && found.profession_id === profession_id) return res.success(found);
  const model = {
    name,
    profession_id,
  };
  const sk = await Skill.create(model);
  if (!sk) return res.fail("Skill could not be created");
  res.success(sk);
});

const getSingleSkill = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const sk = await Skill.findByPk(id);
  res.success(sk);
});

const deleteSkill = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) res.fail("Invalid skill ID", BAD_REQUEST);
  await Skill.destroy({
    where: { id },
  });
  res.success("Skill Deleted");
});

module.exports = {
  _getSkillsOfProfession,
  getAllSkills,
  createSkill,
  getSingleSkill,
  deleteSkill,
};
