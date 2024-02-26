const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { BAD_REQUEST } = require("../constants/errorCodes");
const { ExperienceType } = require("../models/skill");

const _getExperienceTypesOfProfession = async (profession_id) => {
  const data = await ExperienceType.findAll({ where: { profession_id } });
  return data;
};

const getAllExperienceTypes = asyncWrapper(async (_req, res) => {
  const skList = await ExperienceType.findAll();
  res.success(skList);
});

const createExperienceType = asyncWrapper(async (req, res) => {
  const { name, profession_id } = req.body;
  if (!name)
    return res.fail("Experience type name is not provided", BAD_REQUEST);
  if (!profession_id)
    return res.fail(
      "Every Experience type belongs to one profession",
      BAD_REQUEST
    );
  const searchClause = {
    name: {
      [Op.iLike]: `%${name.toLowerCase().trim()}%`,
    },
  };
  const found = await ExperienceType.findOne({ where: searchClause });
  if (found && found.profession_id === profession_id) return res.success(found);
  const model = {
    name,
    profession_id,
  };
  const sk = await ExperienceType.create(model);
  if (!sk) return res.fail("Experience Type could not be created");
  res.success(sk);
});

const getSingleExperienceType = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const sk = await ExperienceType.findByPk(id);
  res.success(sk);
});

const deleteExperienceType = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) res.fail("Invalid experience type ID", BAD_REQUEST);
  await ExperienceType.destroy({
    where: { id },
  });
  res.success("Experience Type Deleted");
});

module.exports = {
  _getExperienceTypesOfProfession,
  getAllExperienceTypes,
  createExperienceType,
  getSingleExperienceType,
  deleteExperienceType,
};
