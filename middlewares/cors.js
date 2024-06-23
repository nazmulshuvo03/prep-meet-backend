const cors = require("cors");
// const path = require("path");
// const dotenv = require("dotenv");

// const environment = process.env.NODE_ENV || "local";

const corsOptions = {
  origin: true,
  credentials: true,
};

// function (origin, callback) {
//       console.log(origin);
//       if (!origin) {
//         console.log("no origin");
//         return callback(null, true);
//       }
//       const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
//       if (allowedOrigins.indexOf(origin) === -1) {
//         console.log("cors issue", origin);
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin." +
//           origin;
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }

function configureCors() {
  return cors(corsOptions);
}

module.exports = { corsOptions, configureCors };
