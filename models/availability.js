const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const Availability = sequelize.define("availability", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  dayHour: { type: DataTypes.BIGINT, allowNull: false },
  dayHourUTC: { type: DataTypes.DATE },
  userId: { type: DataTypes.UUID, allowNull: false },
  state: {
    type: DataTypes.ENUM("OPEN", "BOOKED", "COMPLETED"),
    defaultValue: "OPEN",
  },
  practiceAreas: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  interviewNote: DataTypes.TEXT,
});

const RecurrentAvailability = sequelize.define("recurrentAvailability", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  weekday: { type: DataTypes.INTEGER, allowNull: false },
  hour: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  practiceAreas: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  interviewNote: DataTypes.TEXT,
});

Availability.belongsTo(Profile, {
  foreignKey: "userId",
  targetKey: "id",
  onDelete: "SET NULL",
});
Profile.hasMany(Availability, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = {
  Availability,
  RecurrentAvailability,
};
