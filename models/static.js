const sequelize = require("../db");
const { DataTypes } = require("sequelize");
const { Profile } = require("./user");
const { WorkExperience } = require("./workExperience");
const { InterviewExperience } = require("./interviewExperience");

const ExperienceLevel = sequelize.define(
  "experienceLevel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  },
  { timestamps: false }
);

const PreparationStage = sequelize.define(
  "preparationStage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  },
  { timestamps: false }
);

const Companies = sequelize.define(
  "companies",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    country: DataTypes.STRING,
    sector: DataTypes.STRING,
    industry: DataTypes.STRING,
  },
  { timestamps: false }
);

Profile.hasOne(ExperienceLevel, {
  as: "targetRole",
  foreignKey: "experienceLevel",
  onDelete: "SET NULL",
});

module.exports = {
  ExperienceLevel,
  PreparationStage,
  Companies,
};
