const { Router } = require("express");
const { getAllProfessions } = require("../controllers/profession");

const router = Router();

router.route("/").get((req, res) => {
  res.json({ message: "Hello from profession routes!!!" });
});

router.route("/all").get(getAllProfessions);

module.exports = router;
