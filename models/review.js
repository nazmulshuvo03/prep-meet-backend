const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");
const { Meeting } = require("./meeting");

const Review = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  meetingId: DataTypes.UUID,
  reviewerId: DataTypes.UUID,
  interviewerId: DataTypes.UUID,
  punctuality: DataTypes.INTEGER,
  preparedness: DataTypes.INTEGER,
  depthOfFeedback: DataTypes.INTEGER,
  comments: DataTypes.TEXT,
});

Review.belongsTo(Profile, {
  foreignKey: "reviewerId",
  targetKey: "id",
  onDelete: "CASCADE",
  as: "reviewerProfile",
});

Review.belongsTo(Meeting, {
  foreignKey: "meetingId",
  targetKey: "id",
  onDelete: "CASCADE",
  as: "meeting",
});

const SelfAssessment = sequelize.define("selfAssessment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  meetingId: DataTypes.UUID,
  userId: DataTypes.UUID,
  skillId: DataTypes.UUID,
  answerType1: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  answerType2: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  note: DataTypes.TEXT,
  points: DataTypes.FLOAT,
});

SelfAssessment.belongsTo(Meeting, {
  foreignKey: "meetingId",
  targetKey: "id",
  onDelete: "CASCADE",
  as: "meeting",
});

module.exports = {
  Review,
  SelfAssessment,
};
