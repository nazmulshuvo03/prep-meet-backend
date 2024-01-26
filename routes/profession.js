const { Router } = require("express");
const {
  getAllProfessions,
  createProfession,
  getSingleProfession,
  updateProfession,
  deleteProfession,
} = require("../controllers/profession");

const router = Router();

router
  .route("/")
  .get(getSingleProfession)
  .post(createProfession)
  .put(updateProfession)
  .delete(deleteProfession);
router.route("/all").get(getAllProfessions);

module.exports = router;
