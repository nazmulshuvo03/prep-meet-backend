const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profile } = require("./user");

const Education = sequelize.define("education", {
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
  degree: DataTypes.STRING,
  major: DataTypes.STRING,
  institution: DataTypes.STRING,
  year_of_graduation: DataTypes.INTEGER,
});

Education.belongsTo(Profile, {
  foreignKey: "user_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

Profile.hasMany(Education, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

module.exports = {
  Education,
};
