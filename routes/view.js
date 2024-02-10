const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Prep Meet" });
});

router.get("/oauth/callback", (req, res) => {
  const authorizationCode = req.query.code;
  res.render("oauth-callback", { authorizationCode });
});

module.exports = router;
