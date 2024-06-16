const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const Message = sequelize.define("message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Profile,
      key: "id",
    },
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Profile,
      key: "id",
    },
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Profile.hasMany(Message, { as: "sentMessages", foreignKey: "senderId" });
Profile.hasMany(Message, { as: "receivedMessages", foreignKey: "receiverId" });
Message.belongsTo(Profile, { as: "sender", foreignKey: "senderId" });
Message.belongsTo(Profile, { as: "receiver", foreignKey: "receiverId" });

module.exports = { Message };
