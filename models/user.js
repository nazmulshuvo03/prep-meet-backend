const { DataTypes, Sequelize, Deferrable } = require("sequelize");
const sequelize = require("../db");
const { Profession } = require("./profession");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Profile = sequelize.define("profile", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: User,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  gender: DataTypes.STRING,
  photoURL: DataTypes.STRING,
  role: DataTypes.STRING,
  profileHeadline: DataTypes.TEXT,
  country: DataTypes.STRING,
  language: DataTypes.STRING,
  timeZone: DataTypes.STRING,
  fieldOfStudy: DataTypes.STRING,
  degree: DataTypes.STRING,
  university: DataTypes.STRING,
  profession: {
    type: DataTypes.UUID,
    references: {
      model: Profession,
      key: "id",
      deferrable: Deferrable.INITIALLY_IMMEDIATE,
    },
  },
  currentCompany: DataTypes.STRING,
  yearsOfExperience: DataTypes.INTEGER,
  fieldOfInterest: DataTypes.STRING,
});

Profile.belongsTo(User, { foreignKey: "id", onDelete: "CASCADE" });
User.hasOne(Profile, { foreignKey: "id", onDelete: "CASCADE" });

User.afterCreate(async (user, options) => {
  try {
    await Profile.create({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error creating Profile:", error);
  }
});

module.exports = {
  User,
  Profile,
};
