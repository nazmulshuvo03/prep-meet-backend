const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello, EJS!" });
});

module.exports = router;
