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
  .get(getAllProfessions)
  .post(createProfession)
  .put(updateProfession)
router
  .route("/:id")
  .get(getSingleProfession)
  .delete(deleteProfession);

module.exports = router;
