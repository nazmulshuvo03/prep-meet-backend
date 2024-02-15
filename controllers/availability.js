const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");

const _getAvailabilityById = async (id) => {
  const found = await Availability.findByPk(id);
  return found;
};

const _getAvailabilityByBody = async (body) => {
  const found = await Availability.findOne({ where: { ...body } });
  return found;
};

const _updateAvailabilityState = async (avaiabilityId, state) => {
  const found = await Availability.findOne({
    where: {
      id: avaiabilityId,
    },
  });
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
      dayHour: {
        [Op.gte]: todayMidnight,
      },
    },
  });
  // if (!data) res.fail("User availability data not found", NOT_FOUND);
  res.success(data);
});

const createAvailabilityData = asyncWrapper(async (req, res) => {
  const { userId, dayHour } = req.body;
  const found = await Availability.findOne({
    where: {
      userId,
      dayHour,
    },
  });
  console.log("found: ", found);
  if (found) {
    found.destroy();
    res.success("Deleted");
  } else {
    const model = {
      userId,
      dayHour,
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
  _getAvailabilityByBody,
  _updateAvailabilityState,
  getAllAvailabilityData,
  getUserAvailability,
  createAvailabilityData,
  deleteAvailabilityData,
  deleteAllAvailabilityData,
};
