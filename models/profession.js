const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Profession = sequelize.define("profession", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: DataTypes.STRING,
});

module.exports = {
  Profession,
};
