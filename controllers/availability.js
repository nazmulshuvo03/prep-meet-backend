const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const {
  Availability,
  RecurrentAvailability,
} = require("../models/availability");
const { profileCompletionStatus } = require("../helpers/user");
const MIXPANEL_TRACK = require("../helpers/mixpanel");
const { getDateOfIndexDay } = require("../helpers/timeDate");

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

const _createAvailability = async (data) => {
  const created = await Availability.create(data);
  if (!created)
    res.fail("Availability data could not be created for this user");
  created.dataValues.completionStatus = await profileCompletionStatus(
    data.userId
  );
  return created;
};

const _generateAvailabilityFromRecurrent = async (data) => {
  const { userId, weekday, hour, practiceAreas, interviewNote } = data;
  const dayHourUTC = getDateOfIndexDay(weekday);
  dayHourUTC.setUTCHours(hour, 0, 0, 0);
  const dayHour = dayHourUTC.getTime();
  const found = await Availability.findOne({
    where: {
      userId,
      dayHour,
    },
  });
  if (!found) {
    const model = {
      userId,
      dayHour,
      dayHourUTC,
      practiceAreas,
      interviewNote,
      isRecurring: true,
    };
    await _createAvailability(model);
  }
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
    const created = await _createAvailability(model);
    MIXPANEL_TRACK({
      name: "Availability Added",
      data: { avaiabilityId: created.id, availableTime: created.dayHourUTC },
      id: userId,
    });
    res.success(created);
  }
});

const deleteAvailabilityData = asyncWrapper(async (req, res) => {
  const { avaiabilityId } = req.params;
  if (!avaiabilityId) res.fail("Invalid availability ID", BAD_REQUEST);
  const found = await Availability.findOne({ where: { id: avaiabilityId } });
  found.destroy();
  MIXPANEL_TRACK({
    name: "Availability Deleted",
    data: { avaiabilityId },
    id: found.dataValues.userId,
  });
  const completionStatus = await profileCompletionStatus(found.userId);
  res.success(completionStatus);
});

const deleteAllAvailabilityData = asyncWrapper(async (req, res) => {
  await Availability.destroy({ where: {} });
  res.success("Availability table cleared");
});

const createRecurrentData = asyncWrapper(async (req, res) => {
  const model = {
    weekday: req.body.weekday,
    hour: req.body.hour,
    userId: req.body.userId,
    practiceAreas: req.body.practiceAreas,
    interviewNote: req.body.interviewNote,
  };
  const created = await RecurrentAvailability.create(model);
  if (!created)
    res.fail("Recurrent Availability data could not be created for this user");
  res.success(created);
});

const getRecurrentData = asyncWrapper(async (req, res) => {
  const userId = res.locals.user.id;
  const data = await RecurrentAvailability.findAll({ where: { userId } });
  res.success(data);
});

const generateAvailabilityFromRecurrent = asyncWrapper(async (req, res) => {
  const recurrents = await RecurrentAvailability.findAll();
  for (let occurence of recurrents) {
    await _generateAvailabilityFromRecurrent(occurence);
  }
  res.success("Success");
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
  createRecurrentData,
  getRecurrentData,
  generateAvailabilityFromRecurrent,
};
