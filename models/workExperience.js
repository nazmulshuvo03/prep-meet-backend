const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const WorkExperience = sequelize.define("workExperience", {
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
  jobTitle: {
    type: DataTypes.STRING,
  },
  experienceId: {
    type: DataTypes.INTEGER,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  currentCompany: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

WorkExperience.belongsTo(Profile, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

Profile.hasMany(WorkExperience, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

module.exports = {
  WorkExperience,
};
