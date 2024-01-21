const asyncWrapper = require("../middlewares/async");
const { Profession } = require("../models/profession");

const getAllProfessions = asyncWrapper(async (req, res) => {
  const pfList = await Profession.findAll();
  res.send(pfList);
});

module.exports = {
  getAllProfessions,
};
