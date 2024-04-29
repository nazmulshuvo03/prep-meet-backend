const cron = require("node-cron");
const {
  generateAvailabilityFromRecurrent,
} = require("../controllers/availability");

/**
  0 for minute (0th minute)
  23 for hour (11th hour, which is 11 PM)
  * for day of the month (every day)
  * for month (every month)
  0 for day of the week (Sunday)
 */

cron.schedule("0 23 * * 0", () => {
  generateAvailabilityFromRecurrent();
});

module.exports = { cron };
