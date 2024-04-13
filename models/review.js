const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");

const Review = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  meetingId: DataTypes.UUID,
  userId: DataTypes.UUID,
  interviewerId: DataTypes.UUID,
  punctuality: DataTypes.INTEGER,
  preparedness: DataTypes.INTEGER,
  depthOfFeedback: DataTypes.INTEGER,
  comments: DataTypes.TEXT,
});

module.exports = {
  Review,
};
