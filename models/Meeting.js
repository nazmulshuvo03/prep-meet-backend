const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

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
    allowNull: false,
  },
  url: DataTypes.STRING,
});

module.exports = {
  Meeting,
};
