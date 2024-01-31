const { Op } = require("sequelize");
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

const getUserAvailability = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const today = new Date();
  const todayMidnight = today.setHours(0, 0, 0, 0);
  const data = await Availability.findAll({
    where: {
      userId,
      day: {
        [Op.gte]: todayMidnight,
      },
    },
  });
  res.success(data);
});

const createOrUpdateAvailabilityData = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const model = {
    ...req.body,
  };
  const availabilityDayOfUser = await _findAvailabilityOfUserByDay(
    userId,
    model.day
  );
  if (availabilityDayOfUser) {
    const updated = await _updateAvailabilityOfUserOfDay(
      availabilityDayOfUser,
      model
    );
    res.success(updated);
  } else {
    const created = await _createAvailability(model);
    res.success(created);
  }
});

const deleteSingleAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: { id: req.body.id } });
  res.success("Availability data deleted");
});

const deleteUserAvailability = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  await Availability.destroy({ where: { userId } });
  res.success("Users all availability data deleted");
});

const deleteAllAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: {} });
  res.success("Availability table cleared");
});

module.exports = {
  getAllAvailabilityData,
  getUserAvailability,
  createOrUpdateAvailabilityData,
  deleteSingleAvailabilityData,
  deleteUserAvailability,
  deleteAllAvailabilityData,
};
