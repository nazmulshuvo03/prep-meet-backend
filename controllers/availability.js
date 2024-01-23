const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");

const getAllAvailabilityData = asyncWrapper(async (req, res) => {
  const data = await Availability.findAll();
  res.send(data);
});

const createAvailabilityData = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const data = await Availability.create(model);
  res.send(data);
});

const getSingleAvailabilityData = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const data = await Availability.findByPk(id);
  res.send(data);
});

const updateAvailabilityData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const item = await Availability.findByPk(id);
  if (item) {
    const data = await item.update(updatedFields);
    res.send(data);
  } else {
    res.status(404).send({ message: "Data not found" });
  }
});

const deleteSingleAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: { id: req.body.id } });
});

const deleteAllAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: {} });
});

module.exports = {
  getAllAvailabilityData,
  createAvailabilityData,
  getSingleAvailabilityData,
  updateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteAllAvailabilityData,
};
