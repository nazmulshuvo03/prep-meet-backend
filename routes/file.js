const { Router } = require("express");
const {
  uploadFile,
  fetchFile,
  deleteFile,
  fetchAllFiles,
} = require("../controllers/file");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/fetchAll", fetchAllFiles);
router.route("/:key").get(fetchFile).delete(deleteFile);

module.exports = router;
