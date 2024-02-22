const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const InterviewExperience = sequelize.define("interviewExperience", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  company_id: DataTypes.INTEGER,
  role: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
});

InterviewExperience.belongsTo(Profile, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "SET NULL",
});

Profile.hasMany(InterviewExperience, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

module.exports = {
  InterviewExperience,
};
