const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const CompaniesOfInterest = sequelize.define("companiesOfInterest", {
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
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company_id: DataTypes.INTEGER,
  company_symbol: DataTypes.STRING,
});

// CompaniesOfInterest.belongsTo(Profile, {
//   foreignKey: "user_id",
//   targetKey: "id",
//   onDelete: "SET NULL",
// });

// Profile.hasMany(CompaniesOfInterest, {
//   foreignKey: "user_id",
//   sourceKey: "id",
//   onDelete: "CASCADE",
// });

module.exports = {
  CompaniesOfInterest,
};
