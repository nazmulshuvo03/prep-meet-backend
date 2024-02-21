const { Router } = require("express");
const { getAllSkills, createSkill, getSingleSkill } = require("../controllers/skill");

const router = Router();

router.route("/").get(getAllSkills).post(createSkill);
router.route("/:id").get(getSingleSkill);

module.exports = router;
