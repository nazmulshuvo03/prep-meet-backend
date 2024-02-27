const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    models: [__dirname + "/models/*.js"],
    logging: (msg) => {
      // console.log(sequelize.config);
      // console.log("Message: ", msg);
      return false;
    },
  }
);

module.exports = sequelize;
