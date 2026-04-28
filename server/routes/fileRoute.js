const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");

//Config multer (stockage en mémoire ou disque temporaire)
const storage = multer.memoryStorage(); // garde le fichier en RAM
const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/filesListe", fileController.listFiles);
router.get("/file/:filename", fileController.getFile);
router.delete('/delete/:id', fileController.deleteRapport);
router.get('/download/:id', fileController.downloadRapport);

module.exports = router;
