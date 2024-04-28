const cron = require("node-cron");

// Define cron job 1
cron.schedule("0 0 * * *", () => {
  console.log("Cron job 1: This runs every day at 12 AM");
});

// Define cron job 2
cron.schedule("0 12 * * *", () => {
  console.log("Cron job 2: This runs every day at 12 PM");
});

// Define cron job 3
cron.schedule("*/5 * * * *", () => {
  console.log("Cron job 3: This runs every 5 minutes");
});

// Export the cron jobs if needed
module.exports = { cron };
