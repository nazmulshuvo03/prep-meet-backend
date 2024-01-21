const path = require("path");
const dotenv = require("dotenv");

// Determine the environment
const environment = process.env.NODE_ENV || "local";
const envFile = path.join(__dirname, `.env.${environment}`);

// Load environment variables from the appropriate file
const result = dotenv.config({ path: envFile });

if (result.error) {
  throw result.error;
}

module.exports = result.parsed;
