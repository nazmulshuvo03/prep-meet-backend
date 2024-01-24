const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("prep-meet-db", "postgres", "5t65", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  models: [__dirname + "/models/*.js"],
  // logging: (msg) => {
  //   // console.log(sequelize.config);
  //   console.log("Message: ", msg);
  // },
});

module.exports = sequelize;
