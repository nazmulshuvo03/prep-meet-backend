const { Sequelize, DataTypes, Deferrable } = require("sequelize");
const sequelize = require("../db");
const { User } = require("./user");

const Notification = sequelize.define("notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "SET NULL",
});

module.exports = { Notification };
