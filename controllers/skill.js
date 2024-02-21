const asyncWrapper = require("../middlewares/async");
const { BAD_REQUEST } = require("../constants/errorCodes");
const { Skill } = require("../models/skill");

const getAllSkills = asyncWrapper(async (_req, res) => {
  const skList = await Skill.findAll();
  res.success(skList);
})

const createSkill = asyncWrapper(async (req, res) => {
  const { name, profession_id } = req.body;
  if (!name) return res.fail("Skill name is not provided", BAD_REQUEST);
  if (!profession_id) return res.fail("Every skill belongs to one profession", BAD_REQUEST);
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

module.exports = {
  getAllSkills,
  createSkill,
  getSingleSkill
}
