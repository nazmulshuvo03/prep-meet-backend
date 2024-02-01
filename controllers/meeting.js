const asyncWrapper = require("../middlewares/async");
const { Meeting } = require("../models/meeting");
const { Profile } = require("../models/user");
const {
  _getAvailabilityById,
  _updateAvailabilityState,
} = require("./availability");

const getAllMeetingData = asyncWrapper(async (req, res) => {
  const data = await Meeting.findAll();
  res.success(data);
});

const createMeetingData = asyncWrapper(async (req, res) => {
  const { availabilityId, acceptorId } = req.body;
  const availabilityData = await _getAvailabilityById(availabilityId);
  await _updateAvailabilityState(availabilityId, "BOOKED");

  const model = {
    initiator: availabilityData.userId,
    acceptor: acceptorId,
    day: parseInt(availabilityData.day),
    hour: availabilityData.hour,
    dayHour: parseInt(availabilityData.dayHour),
    url: "https://www.google.com",
  };
  const meetingCreated = await Meeting.create(model);
  if (!meetingCreated) res.fail("Meeting could not be created for this user");
  res.success(meetingCreated);
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
  createMeetingData,
  getSingleMeetingData,
  updateMeetingData,
  deleteSingleMeetingData,
  deleteAllMeetingData,
};
