const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const Meeting = sequelize.define("meeting", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  initiator: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  acceptor: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("REQUESTED", "ACCEPTED", "REJECTED"),
    defaultValue: "REQUESTED",
  },
  url: DataTypes.STRING,
});

Meeting.belongsTo(Profile, {
  foreignKey: "initiator",
  targetKey: "id",
  onDelete: "CASCADE",
  as: "initiatorProfile",
});

Meeting.belongsTo(Profile, {
  foreignKey: "acceptor",
  targetKey: "id",
  onDelete: "CASCADE",
  as: "acceptorProfile",
});

Profile.hasMany(Meeting, {
  foreignKey: "initiator",
  sourceKey: "id",
  onDelete: "SET NULL",
  as: "initiatedMeetings",
});

Profile.hasMany(Meeting, {
  foreignKey: "acceptor",
  sourceKey: "id",
  onDelete: "SET NULL",
  as: "acceptedMeetings",
});

module.exports = {
  Meeting,
};