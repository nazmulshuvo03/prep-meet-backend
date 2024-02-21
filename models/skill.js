const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../db");
const { Profession } = require("./profession");

const Skill = sequelize.define("skill", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profession_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

Skill.belongsTo(Profession, {
  foreignKey: "profession_id",
  targetKey: "id",
  onDelete: "SET NULL",
})

Profession.hasMany(Skill, {
  foreignKey: "profession_id",
  sourceKey: "id",
  onDelete: "CASCADE",
})

module.exports = {
  Skill
}
