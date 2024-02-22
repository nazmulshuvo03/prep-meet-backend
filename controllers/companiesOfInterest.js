const { BAD_REQUEST, NOT_FOUND } = require("../constants/errorCodes");
const asyncWrapper = require("../middlewares/async");
const { CompaniesOfInterest } = require("../models/companiesOfInterest");

const getAllCompaniesOfInterest = asyncWrapper(async (req, res) => {
  const list = await CompaniesOfInterest.findAll();
  res.success(list);
});

const createCompaniesOfInterest = asyncWrapper(async (req, res) => {
  const dataModel = req.body;
  const created = await CompaniesOfInterest.create(dataModel);
  if (!created) return res.fail("CompaniesOfInterest could not be added");
  res.success(created);
});

const getSingleCompaniesOfInterest = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);
  const file = await CompaniesOfInterest.findOne({ where: { id } });
  res.success(file);
});

const updateCompaniesOfInterest = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  if (!id) return res.fail("ID is not provided", BAD_REQUEST);

  const found = await CompaniesOfInterest.findByPk(id);
  if (!found) res.fail("Data not found", NOT_FOUND);

  const updated = await found.update(updatedData);
  res.success(updated);
});

module.exports = {
  getAllCompaniesOfInterest,
  createCompaniesOfInterest,
  getSingleCompaniesOfInterest,
  updateCompaniesOfInterest,
};
