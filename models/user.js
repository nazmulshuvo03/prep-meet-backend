const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: DataTypes.STRING,
});

module.exports = {
  User,
};
