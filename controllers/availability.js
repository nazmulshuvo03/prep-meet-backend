const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");
const { NOT_FOUND } = require("../constants/errorCodes");

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
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
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
  // if (!data) res.fail("User availability data not found", NOT_FOUND);
  res.success(data);
});

const createOrUpdateAvailabilityData = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
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
    if (!updated) res.fail("Availability data update failed");
    res.success(updated);
  } else {
    const created = await _createAvailability(model);
    if (!created)
      res.fail("Availability data could not be created for this user");
    res.success(created);
  }
});

const deleteUserAvailability = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  if (!userId) res.fail("Invalid user ID", BAD_REQUEST);
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
  deleteUserAvailability,
  deleteAllAvailabilityData,
};
