const asyncWrapper = require("../middlewares/async");
const { Meeting } = require("../models/meeting");
const { Profile } = require("../models/user");

const getAllMeetingData = asyncWrapper(async (req, res) => {
  const data = await Meeting.findAll();
  res.success(data);
});

const createMeetingData = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };

  const data = await Meeting.create(model);
  res.success(data);
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
