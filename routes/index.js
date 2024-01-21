const { Router } = require("express");
const userRoutes = require("./user");
const professionRoutes = require("./profession");

const router = Router();

router.route("/").get((req, res) => {
  res.json({ message: "Hello from the Prep Meet backend!!!" });
});

router.use("/user", userRoutes);
router.use("/profession", professionRoutes);

module.exports = router;
