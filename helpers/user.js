const { Op } = require("sequelize");
const { Availability } = require("../models/availability");
const { Profile } = require("../models/user");
const { WorkExperience } = require("../models/workExperience");

const profileCompletionStatus = async (profileId) => {
  try {
    const profile = await Profile.findOne({
      where: { id: profileId },
      include: [
        WorkExperience,
        {
          model: Availability,
          required: false,
          where: {
            dayHour: {
              [Op.gte]: new Date().getTime(),
            },
          },
        },
      ],
      order: [
        ["availabilities", "dayHourUTC", "ASC"],
        ["workExperiences", "startDate", "DESC"],
      ],
    });
    return {
      companiesOfInterest: !!(
        profile.companiesOfInterest && profile.companiesOfInterest.length
      ),
      focusAreas: !!(profile.focusAreas && profile.focusAreas.length),
      typesOfExperience: !!(
        profile.typesOfExperience && profile.typesOfExperience.length
      ),
      experienceLevel: !!profile.experienceLevel,
      preparationStage: !!profile.preparationStage,
      workExperiences: !!(
        profile.workExperiences && profile.workExperiences.length
      ),
      availabilities: !!(
        profile.availabilities && profile.availabilities.length
      ),
    };
  } catch (err) {
    console.log(
      "Error in profile completion status: ",
      profileCompletionStatus
    );
    return null;
  }
};

const isProfileComplete = async (profileId) => {
  const status = await profileCompletionStatus(profileId);
  return Object.values(status).every((value) => value === true);
};

module.exports = {
  isProfileComplete,
  profileCompletionStatus,
};
