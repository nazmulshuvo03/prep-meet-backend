const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

const Profession = sequelize.define("profession", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = {
  Profession,
};
