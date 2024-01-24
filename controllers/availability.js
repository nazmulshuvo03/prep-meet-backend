const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");

const getAllAvailabilityData = asyncWrapper(async (req, res) => {
  const data = await Availability.findAll();
  res.success(data);
});

const createAvailabilityData = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };

  const data = await Availability.create(model);
  res.success(data);
});

const getSingleAvailabilityData = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const data = await Availability.findByPk(id);

  if (!data) res.fail("Availability data not found");
  res.success(data);
});

const updateAvailabilityData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update.");

  const item = await Availability.findByPk(id);
  if (!item) res.fail("Availability data not found");

  const data = await item.update(updatedFields);
  if (!data) res.fail("Availability update failed");

  res.success(data);
});

const deleteSingleAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: { id: req.body.id } });
  res.success("Availability data deleted");
});

const deleteAllAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: {} });
  res.success("Availability table cleared");
});

module.exports = {
  getAllAvailabilityData,
  createAvailabilityData,
  getSingleAvailabilityData,
  updateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteAllAvailabilityData,
};
