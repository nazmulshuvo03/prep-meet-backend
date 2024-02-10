const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/async");
const { Meeting } = require("../models/meeting");
const { Profile } = require("../models/user");
const {
  _getAvailabilityById,
  _updateAvailabilityState,
  _getAvailabilityByBody,
} = require("./availability");
const { NOT_FOUND, UNPROCESSABLE_DATA } = require("../constants/errorCodes");
const { sendMeetingEmail } = require("../helpers/emailMeeting");
const { _getUserProfile } = require("./user");
const { createMeeting } = require("../helpers/meeting");

const getAllMeetingData = asyncWrapper(async (req, res) => {
  const data = await Meeting.findAll();
  res.success(data);
});

const getUsersMeetingData = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const data = await Meeting.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [{ initiator: userId }, { acceptor: userId }],
        },
        {
          day: {
            [Op.gte]: new Date().getTime(),
          },
        },
      ],
    },
    include: [
      { model: Profile, as: "initiatorProfile", foreignKey: "initiator" },
      { model: Profile, as: "acceptorProfile", foreignKey: "acceptor" },
    ],
    order: [["dayHour", "ASC"]],
  });
  res.success(data);
});

const createMeetingData = asyncWrapper(async (req, res) => {
  const { availabilityId, acceptorId } = req.body;
  const availabilityData = await _getAvailabilityById(availabilityId);
  if (!availabilityData)
    res.fail("Availability data not found with this ID", NOT_FOUND);

  const updated = await _updateAvailabilityState(availabilityId, "BOOKED");
  if (!updated)
    res.fail("Availability state could not be updated", UNPROCESSABLE_DATA);

  const initiatorProfile = await _getUserProfile(availabilityData.userId);
  const acceptorProfile = await _getUserProfile(acceptorId);
  const meetingCreation = await createMeeting(
    initiatorProfile.dataValues.email,
    acceptorProfile.dataValues.email,
    availabilityData.dataValues
  );
  if (!meetingCreation.created) {
    if (meetingCreation.redirect) {
      res.fail(meetingCreation.redirectUrl);
    } else {
      res.fail(meetingCreation.message);
    }
  }
  const model = {
    initiator: availabilityData.userId,
    acceptor: acceptorId,
    day: parseInt(availabilityData.day),
    hour: availabilityData.hour,
    dayHour: parseInt(availabilityData.dayHour),
    url: meetingCreation.meetLink,
  };
  const meetingCreated = await Meeting.create(model);
  if (!meetingCreated) res.fail("Meeting could not be created for this user");
  res.success(model);
});

const cancelMeeting = asyncWrapper(async (req, res) => {
  const { meetingId, userId } = req.body;
  const found = await Meeting.findByPk(meetingId);
  if (!found) res.fail("Meeting data not found");
  if (userId === found.acceptor || userId === found.initiator) {
    const availability = await _getAvailabilityByBody({
      userId: found.initiator,
      day: found.day,
      hour: found.hour,
      dayHour: found.dayHour,
    });
    if (!availability) res.fail("Availability data not found");
    const updated = await _updateAvailabilityState(availability.id, "OPEN");
    if (!updated)
      res.fail("Availability state could not be updated", UNPROCESSABLE_DATA);
    found.destroy();
    res.success("Meeting canceled");
  } else {
    res.fail("This meeting does not belong to you");
  }
});

const getSingleMeetingData = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  const data = await Meeting.findOne({
    where: { id },
    include: [
      { model: Profile, as: "initiatorProfile", foreignKey: "initiator" },
      { model: Profile, as: "acceptorProfile", foreignKey: "acceptor" },
    ],
  });

  if (!data) res.fail("Meeting data not found");
  res.success(data);
});

const updateMeetingData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0)
    res.fail("No fields provided for update");

  const item = await Meeting.findByPk(id);
  if (!item) res.fail("Meeting data not found");

  const data = await item.update(updatedFields);
  if (!data) res.fail("Profession update failed");

  res.success(data);
});

const deleteSingleMeetingData = asyncWrapper(async (req, res) => {
  await Meeting.destroy({ where: { id: req.body.id } });
  res.success("Meeting data deleted");
});

const deleteAllMeetingData = asyncWrapper(async (req, res) => {
  await Meeting.destroy({ where: {} });
  res.success("Meeting table cleared");
});

module.exports = {
  getAllMeetingData,
  getUsersMeetingData,
  createMeetingData,
  getSingleMeetingData,
  updateMeetingData,
  cancelMeeting,
  deleteSingleMeetingData,
  deleteAllMeetingData,
};
