const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configurer multer pour stocker les fichiers dans un dossier local "uploads"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier où les images seront sauvegardées
  },
  filename: function (req, file, cb) {
    // Par exemple : profil-1630813325467.jpg
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, 'profil-' + uniqueSuffix);
  }
});
const upload = multer({ storage: storage });

// Créer la route POST d'upload
router.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé' });
  }

  
  //const imageUrl = `/uploads/${req.file.filename}`;
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.json({ url: imageUrl });
});

module.exports = router;
