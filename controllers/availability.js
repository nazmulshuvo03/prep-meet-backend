const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");
const { NOT_FOUND } = require("../constants/errorCodes");
const { convertToUnixDateTime } = require("../helpers/timeDate");

const _getAvailabilityById = async (id) => {
  const found = await Availability.findByPk(id);
  if (!found) res.fail("Availability data not found with this ID", NOT_FOUND);
  return found;
};

const _updateAvailabilityState = async (avaiabilityId, state) => {
  const found = await Availability.findOne({
    where: {
      id: avaiabilityId,
    },
  });
  if (!found) res.fail("Availability data not found with this ID", NOT_FOUND);
  return found.update({ state });
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

const createAvailabilityData = asyncWrapper(async (req, res) => {
  const { userId, day, hour } = req.body;
  const found = await Availability.findOne({
    where: {
      userId,
      day,
      hour,
    },
  });
  console.log("found: ", found);
  if (found) {
    found.destroy();
    res.success("Deleted");
  } else {
    const dateTime = convertToUnixDateTime(parseInt(day), parseInt(hour));
    const model = {
      userId,
      day,
      hour,
      dayHour: dateTime,
    };
    const created = await Availability.create(model);
    if (!created)
      res.fail("Availability data could not be created for this user");
    res.success(created);
  }
});

const deleteAvailabilityData = asyncWrapper(async (req, res) => {
  const { avaiabilityId } = req.params;
  if (!avaiabilityId) res.fail("Invalid availability ID", BAD_REQUEST);
  await Availability.destroy({ where: { id: avaiabilityId } });
  res.success("Availability data deleted");
});

const deleteAllAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: {} });
  res.success("Availability table cleared");
});

module.exports = {
  _getAvailabilityById,
  _updateAvailabilityState,
  getAllAvailabilityData,
  getUserAvailability,
  createAvailabilityData,
  deleteAvailabilityData,
  deleteAllAvailabilityData,
};
