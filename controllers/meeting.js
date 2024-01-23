const asyncWrapper = require("../middlewares/async");
const { Meeting } = require("../models/meeting");
const { Profile } = require("../models/user");

const getAllMeetingData = asyncWrapper(async (req, res) => {
  const data = await Meeting.findAll();
  res.send(data);
});

const createMeetingData = asyncWrapper(async (req, res) => {
  const model = {
    ...req.body,
  };
  const data = await Meeting.create(model);
  res.send(data);
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
  res.send(data);
});

const updateMeetingData = asyncWrapper(async (req, res) => {
  const { id, ...updatedFields } = req.body;

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).send({ message: "No fields provided for update." });
  }

  const item = await Meeting.findByPk(id);
  if (item) {
    const data = await item.update(updatedFields);
    res.send(data);
  } else {
    res.status(404).send({ message: "Data not found" });
  }
});

const deleteSingleMeetingData = asyncWrapper(async (req, res) => {
  await Meeting.destroy({ where: { id: req.body.id } });
});

const deleteAllMeetingData = asyncWrapper(async (req, res) => {
  await Meeting.destroy({ where: {} });
});

module.exports = {
  getAllMeetingData,
  createMeetingData,
  getSingleMeetingData,
  updateMeetingData,
  deleteSingleMeetingData,
  deleteAllMeetingData,
};
