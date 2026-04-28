const mongoose = require("mongoose");
const Farm = require("../models/Farm");

// Créer une ferme
exports.creerFerme = async (req, res) => {
  try {
    const {
      name,
      location,
      temperatureSensor,
      humiditySensor,
      phSensor,
      area
    } = req.body;

    // Champs obligatoires
    if (!name || !location) {
      return res.status(400).json({
        message: "Le nom et la localisation sont obligatoires"
      });
    }

    // Utiliser l'ID de l'utilisateur authentifié
    const owner = req.user.userId;
    if (temperatureSensor && !mongoose.Types.ObjectId.isValid(temperatureSensor)) {
      return res.status(400).json({ message: "ID du capteur de température invalide" });
    }
    if (humiditySensor && !mongoose.Types.ObjectId.isValid(humiditySensor)) {
      return res.status(400).json({ message: "ID du capteur d'humidité invalide" });
    }
    if (phSensor && !mongoose.Types.ObjectId.isValid(phSensor)) {
      return res.status(400).json({ message: "ID du capteur de pH invalide" });
    }

    const nouvelleFerme = new Farm({
      name,
      location,
      area: area || null,
      temperatureSensor: temperatureSensor || null,
      humiditySensor: humiditySensor || null,
      phSensor: phSensor || null,
      owner,
      createdAt: new Date()
    });

    const fermeSauvegardee = await nouvelleFerme.save();

    return res.status(201).json(fermeSauvegardee);

  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(err.errors).map(e => e.message).join(", ")
      });
    }
    return res.status(500).json({
      message: err.message || "Erreur lors de la création de la ferme"
    });
  }
};

// Lister toutes les fermes
exports.afficherLesFermes = async (req, res) => {
  try {
    const farms = await Farm.find()
      .populate("owner", "user_id firstName lastName")
    
      console.log("farms trouvés : ",farms)
    return res.json(farms);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Lister toutes les fermes d’un utilisateur donné
exports.afficherFermesParUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const farms = await Farm.find({ owner: userId })
      .populate("temperatureSensor")
      .populate("humiditySensor")
      .populate("phSensor");

    return res.json(farms);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Supprimer une ferme par ID
exports.supprimerFerme = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de la ferme invalide" });
    }

    // Vérifier que l'utilisateur possède la ferme
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: "Ferme non trouvée" });
    }

    if (farm.owner.toString() !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette ferme" });
    }

    const deletedFarm = await Farm.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Ferme supprimée avec succès",
      data: deletedFarm
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

//Modifier les informations d'une ferme
exports.modifierFerme = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Le nom de la ferme est requis" });
    }

    // Vérifier la validité de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de la ferme invalide" });
    }

    // Vérifier que la ferme existe
    const farm = await Farm.findById(id);
    if (!farm) {
      return res.status(404).json({ message: "Ferme non trouvée" });
    }

    // On vérifie que c’est bien le propriétaire
    if (farm.owner.toString() !== userId) {
      return res.status(403).json({ message: "Non autorisé à modifier cette ferme" });
    }

    farm.name = name;
    const updatedFarm = await farm.save();

    return res.json(updatedFarm);

  } catch (err) {
    console.error("Erreur dans modifierFerme :", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.afficherFermesParUtilisateur = async (req, res) => {
  try {
    const { userId } = req.params;
    const farms = await Farm.find({ owner: userId }).populate("owner", "firstName lastName");
    return res.json(farms);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

