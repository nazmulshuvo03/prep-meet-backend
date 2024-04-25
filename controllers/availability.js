const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { Availability } = require("../models/availability");
const { profileCompletionStatus } = require("../helpers/user");
const MIXPANEL_TRACK = require("../helpers/mixpanel");

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
  const today = new Date().getTime();
  const data = await Availability.findAll({
    where: {
      userId,
      dayHour: {
        [Op.gte]: today,
      },
    },
    order: [["dayHour", "ASC"]],
  });
  // if (!data) res.fail("User availability data not found", NOT_FOUND);
  res.success(data);
});

const createAvailabilityData = asyncWrapper(async (req, res) => {
  const { userId, dayHourUTC, practiceAreas, interviewNote } = req.body;
  const dayHour = new Date(dayHourUTC).getTime();
  const found = await Availability.findOne({
    where: {
      userId,
      dayHour,
    },
  });
  if (found) {
    res.fail("Already added");
  } else {
    const model = {
      userId,
      dayHour,
      dayHourUTC,
      practiceAreas,
      interviewNote,
    };
    const created = await Availability.create(model);
    MIXPANEL_TRACK({
      name: "Availability Added",
      data: { avaiabilityId: created.id, availableTime: created.dayHourUTC },
      id: userId,
    });
    if (!created)
      res.fail("Availability data could not be created for this user");
    created.dataValues.completionStatus = await profileCompletionStatus(userId);
    res.success(created);
  }
});

const deleteAvailabilityData = asyncWrapper(async (req, res) => {
  const { avaiabilityId } = req.params;
  if (!avaiabilityId) res.fail("Invalid availability ID", BAD_REQUEST);
  const found = await Availability.findOne({ where: { id: avaiabilityId } });
  found.destroy();
  const completionStatus = await profileCompletionStatus(found.userId);
  res.success(completionStatus);
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
