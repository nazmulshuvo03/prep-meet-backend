const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const config = require("./config");
const Routes = require("./routes");
const sequelize = require("./db");
const { responseMiddleware } = require("./middlewares/Response");
const { requestLogger } = require("./middlewares/logger");
const viewRoutes = require("./routes/view");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "views"));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express();
const port = config.PORT;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLogger);
app.use(responseMiddleware);
app.use(connectLiveReload());

app.use("/", viewRoutes);
app.use("/api/v1", Routes);

sequelize
  .sync({ alter: true })
  .then(() => {
    try {
      console.log("Database connected!!");
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
