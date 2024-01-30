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
  password: DataTypes.STRING,
  email_varified: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.ENUM("USER", "ADMIN"), defaultValue: "USER" },
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  gender: DataTypes.STRING,
  photoURL: {
    type: DataTypes.STRING,
    defaultValue:
      "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-1024.png",
  },
  profileHeadline: DataTypes.TEXT,
  country: DataTypes.STRING,
  language: DataTypes.STRING,
  timeZone: DataTypes.STRING,
  fieldOfStudy: DataTypes.STRING,
  degree: DataTypes.STRING,
  university: DataTypes.STRING,
  professionId: {
    type: DataTypes.UUID,
  },
  currentCompany: DataTypes.STRING,
  yearsOfExperience: DataTypes.INTEGER,
  fieldOfInterest: DataTypes.STRING,
});

Profile.belongsTo(User, { foreignKey: "id", onDelete: "CASCADE" });
User.hasOne(Profile, { foreignKey: "id", onDelete: "CASCADE" });

Profile.belongsTo(Profession, {
  foreignKey: "professionId",
  onDelete: "SET NULL",
});
Profession.hasOne(Profile, {
  foreignKey: "professionId",
  onDelete: "SET NULL",
});

// Hook to update the email in the Profile table before updating a User
User.beforeUpdate(async (user, options) => {
  try {
    await Profile.update({ email: user.email }, { where: { id: user.id } });
  } catch (error) {
    console.error("Error updating Profile:", error);
    throw new Error("Failed to update Profile during user update.");
  }
});

// Hook to create profile table with same user id after creating user table
User.afterCreate(async (user, options) => {
  try {
    await Profile.create({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Error creating Profile:", error);
  }
});

// Hook to check if the new email in the Profile table matches the existing email in the User table
Profile.beforeUpdate(async (profile, options) => {
  try {
    const user = await User.findOne({ where: { id: profile.id } });

    if (profile.email !== user.email) {
      throw new Error("Email should be updated in User table only");
    }
  } catch (error) {
    console.error("Error checking email update:", error);
    throw new Error("Failed to check email update.");
  }
});

module.exports = {
  User,
  Profile,
};
