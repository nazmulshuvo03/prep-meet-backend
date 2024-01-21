const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config");
const Routes = require("./routes");
const sequelize = require("./db");

const app = express();
const port = config.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", Routes);

sequelize
  .sync({ force: true })
  .then(() => {
    try {
      console.log("Database connected!!!");
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (err) {
      console.log(`Error in running server: ${err}`);
    }
  })
  .catch((error) => {
    console.error("Sequelize synchronization error: ", error);
  });
