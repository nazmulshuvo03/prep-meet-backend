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
  day: DataTypes.BIGINT,
  hours: DataTypes.ARRAY(DataTypes.INTEGER),
});

Availability.belongsTo(Profile, {
  foreignKey: "uid",
  targetKey: "id",
  onDelete: "SET NULL",
});
Profile.hasOne(Availability, {
  foreignKey: "uid",
  onDelete: "CASCADE",
});

module.exports = {
  Availability,
};
