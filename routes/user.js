const { Router } = require("express");

const router = Router();

router.route("/").get((req, res) => {
  res.json({ message: "Hello from user routes!!!" });
});

module.exports = router;
