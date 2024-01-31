const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");

const _findAvailabilityOfUserByDay = async (userId, day) => {
  const found = await Availability.findOne({ where: { userId, day } });
  return found;
};

const _createAvailability = async (data) => {
  const created = await Availability.create(data);
  return created;
};

const _updateAvailabilityOfUserOfDay = async (oldData, newData) => {
  const updated = await oldData.update(newData);
  return updated;
};

const getAllAvailabilityData = asyncWrapper(async (req, res) => {
  const data = await Availability.findAll();
  res.success(data);
});

const createOrUpdateAvailabilityData = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const availabilityDayOfUser = await _findAvailabilityOfUserByDay(
    model.userId,
    model.day
  );
  if (availabilityDayOfUser) {
    const updated = await _updateAvailabilityOfUserOfDay(
      availabilityDayOfUser,
      model
    );
    // const data = await Availability.create(model);
    res.success(model);
  } else {
    const created = await _createAvailability(model);
    // const data = await Availability.create(model);
    res.success(model);
  }
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
  createOrUpdateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteAllAvailabilityData,
};
