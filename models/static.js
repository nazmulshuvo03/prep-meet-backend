const sequelize = require("../db");
const { DataTypes } = require("sequelize");

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
/**
 * symbol VARCHAR(255),
    name VARCHAR(255),
    country VARCHAR(255),
    sector VARCHAR(255),
    industry VARCHAR(255)
 */
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

module.exports = {
  ExperienceLevel,
  PreparationStage,
  Companies,
};
