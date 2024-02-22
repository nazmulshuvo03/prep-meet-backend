const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { Education } = require("../models/education");

const getAllEducation = asyncWrapper(async (req, res) => {
  const list = await Education.findAll();
  res.success(list);
});

const createEducation = asyncWrapper(async (req, res) => {
  const dataModel = req.body;
  const created = await Education.create(dataModel);
  if (!created) return res.fail("Education could not be added");
  res.success(created);
});

const getSingleEducation = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const file = await Education.findOne({ where: { id } });
  res.success(file);
});

const updateEducation = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);

  const found = await Education.findByPk(id);
  if (!found) res.fail("Data not found", NOT_FOUND);

  const updated = await found.update(updatedData);
  res.success(updated);
});

module.exports = {
  getAllEducation,
  createEducation,
  getSingleEducation,
  updateEducation,
};
