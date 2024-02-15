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
  state: {
    type: DataTypes.ENUM("OPEN", "BOOKED", "COMPLETED"),
    defaultValue: "OPEN",
  },
});

Availability.belongsTo(Profile, {
  foreignKey: "userId",
  targetKey: "id",
  onDelete: "SET NULL",
});
// Profile.hasMany(Availability, {
//   foreignKey: "userId",
//   onDelete: "CASCADE",
// });

module.exports = {
  Availability,
};
