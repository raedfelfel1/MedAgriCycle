const mongoose = require("mongoose");
const { GridFSBucket, ObjectId } = require("mongodb");
const fs = require("fs");
const File=require('../models/File');

// Initialise GridFSBucket une fois la connexion ouverte
let bucket;
mongoose.connection.once("open", () => {
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
});

// Upload d’un fichier
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", (file) => {
      res.json({ message: "Fichier uploadé avec succès", file });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ message: "Erreur lors de l'upload", error: err });
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Lister tous les fichiers
exports.listFiles = async (req, res) => {
  try {
    const files = await bucket.find().toArray();
    console.log("bucket : ",bucket)
    console.log("files :  ",files)
    if (!files || files.length === 0) return res.status(404).json({ message: "Aucun fichier trouvé" });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Télécharger un fichier par son nom
exports.getFile = async (req, res) => {
  try {
    const file = await bucket.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) return res.status(404).json({ message: "Fichier introuvable" });

    res.set("Content-Type", file[0].contentType);
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
      res.status(500).json({ message: "Erreur téléchargement", error: err });
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Supprimer un rapport par ID
exports.deleteRapport = async (req, res) => {
  const { id } = req.params;

  try {
    const rapport = await File.findById(id);
    if (!rapport) return res.status(404).json({ message: 'Rapport introuvable' });

    

    await File.findByIdAndDelete(id);
    res.json({ message: 'Rapport supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.downloadRapport = async (req, res) => {
  const { id } = req.params;
  console.log("ID reçu:", id, "Type:", typeof id);
  
  try {
    // Vérifiez si l'ID est un ObjectId valide
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('ID de rapport invalide');
    }

    const rapport = await File.findById(id);
    console.log("Rapport trouvé:", rapport);
    
    if (!rapport) {
      return res.status(404).send('Rapport introuvable');
    }

    const readstream = gfs.createReadStream({ _id: rapport.fileId });
    res.set('Content-Disposition', `attachment; filename="${rapport.name}"`);
    readstream.pipe(res);
  } catch (err) {
    console.error('Erreur détaillée:', err);
    res.status(500).send('Erreur serveur');
  }
};