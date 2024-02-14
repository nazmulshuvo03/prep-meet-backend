const { Router } = require("express");
const { uploadFile, fetchFile, deleteFile } = require("../controllers/file");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/upload", upload.single("file"), uploadFile);
router.get("/fetch", fetchFile);
router.delete("/delete", deleteFile);

module.exports = router;
