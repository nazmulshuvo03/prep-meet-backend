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
  profession_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
  },
  start_date: {
    type: DataTypes.DATE,
  },
  end_date: {
    type: DataTypes.DATE,
  },
});

WorkExperience.belongsTo(Profile, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "SET NULL",
});

Profile.hasMany(WorkExperience, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

module.exports = {
  WorkExperience,
};
