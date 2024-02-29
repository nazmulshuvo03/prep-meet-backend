const { Op } = require("sequelize");
const sequelize = require("../../db");

const profileQueryOptions = (queryParameters, userProfile) => {
  const { id, targetProfessionId } = userProfile;
  const today = new Date();
  const todayMidnight = today.setHours(0, 0, 0, 0);

  const queryOptions = {
    where: id // user should not get profile in dashbaord
      ? {
          id: {
            [Op.ne]: id,
          },
          // targetProfessionId, // Activate this to get users only with same target profession
        }
      : {},
    order: [
      [
        sequelize.literal(
          `CASE WHEN "availabilities"."dayHour" > '${todayMidnight}' THEN 1 ELSE 2 END`
        ),
        "ASC",
      ],
      ["availabilities", "dayHour", "ASC"],
    ],
  };
  if (Object.keys(queryParameters).length) {
    Object.keys(queryParameters).forEach((param) => {
      const value = queryParameters[param];

      if (param === "name") {
        // Handling search by name
        queryOptions.where[Op.or] = [
          { firstName: { [Op.iLike]: `%${value}%` } },
          { lastName: { [Op.iLike]: `%${value}%` } },
        ];
      } else if (param === "companiesOfInterest") {
        // Handling search by companiesOfInterest
        queryOptions.where.companiesOfInterest = {
          // Using Op.contains to check if the array contains the provided value
          [Op.contains]: [value],
        };
      } else if (param === "focusAreas") {
        // Handling search by focusAreas
        queryOptions.where.focusAreas = {
          // Using Op.contains to check if the array contains the provided value
          [Op.contains]: [value],
        };
      } else if (param === "typesOfExperience") {
        // Handling search by typesOfExperience
        queryOptions.where.typesOfExperience = {
          // Using Op.contains to check if the array contains the provided value
          [Op.contains]: [value],
        };
      } else if (!isNaN(value)) {
        // Check if the value is a number
        // If it's a number, check if it's prefixed with "_lt" or "_gt" or "_lte" or "_gte"
        if (param.endsWith("_lt")) {
          queryOptions.where[param.slice(0, -3)] = {
            [Op.lt]: value,
          };
        } else if (param.endsWith("_gt")) {
          queryOptions.where[param.slice(0, -3)] = {
            [Op.gt]: value,
          };
        } else if (param.endsWith("_lte")) {
          queryOptions.where[param.slice(0, -4)] = {
            [Op.lte]: value,
          };
        } else if (param.endsWith("_gte")) {
          queryOptions.where[param.slice(0, -4)] = {
            [Op.gte]: value,
          };
        } else {
          queryOptions.where[param] = value;
        }
      } else {
        // If it's not a number, use equality
        queryOptions.where[param] = value;
      }
    });
  }
  return queryOptions;
};

module.exports = {
  profileQueryOptions,
};
