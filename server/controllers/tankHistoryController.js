const TankHistory = require("../models/TankHistory");
const Tank = require("../models/Tank");
const Farm = require("../models/Farm")

// Lister tous les historiques
exports.afficherLesTankHistories = async (req, res) => {
  try {
    const { tank, product } = req.query; // ✅ On vérifie les query params
    let histories;

    if (tank) {
      histories = await TankHistory.find({ tank }).sort({ date: -1 });
    } else if (product) {
      histories = await TankHistory.find({ product }).sort({ date: -1 });
    } else {
      histories = await TankHistory.find().sort({ date: -1 });
    }
    
    return res.json(histories);
  } catch (error) {

    return res.status(500).json({ message: "Erreur lors du chargement de l’historique", error });
  }
};

// Créer un historique
exports.creerTankHistory = async (req, res) => {
  try {
    const history = new TankHistory(req.body);
    await history.save();
    return res.status(201).json(history);
  } catch (error) {
    return res.status(400).json({ message: "Erreur lors de la création de l'historique", error });
  }
};

// Récupérer un historique par ID
exports.afficherUnTankHistory = async (req, res) => {
  try {
    const history = await TankHistory.find({tankId:req.params.id})
    if (!history) return res.status(404).json({ message: "Historique introuvable" });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du chargement de l'historique", error });
  }
};

// Récupérer par tank
exports.getHistoriesByTank = async (req, res) => {
  try {
    const histories = await TankHistory.find({ tank: req.params.tankId }).populate("product");
    return res.status(200).json(histories);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du chargement des historiques du tank", error });
  }
};

// Récupérer par produit
exports.getHistoriesByProduct = async (req, res) => {
  try {
    const histories = await TankHistory.find({ product: req.params.productId }).populate("tank");
    return res.status(200).json(histories);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors du chargement des historiques du produit", error });
  }
};

exports.getLastTankHistory = async (req, res) => {
  try {
    const tankId = req.params.tankId;

    // 🔹 Cherche le dernier historique lié à ce tank
    const lastHistory = await TankHistory.findOne({ tankId: tankId })
      .sort({ timestamp: -1 });

    if (!lastHistory) {
      return res.status(201).json(lastHistory);
    }

    return res.status(200).json(lastHistory);

  } catch (error) {
    console.error("Erreur getLastTankHistory :", error);
    return res.status(500).json({
      message: "Erreur lors du chargement de l'historique",
      error
    });
  }
};


// Modifier un historique
exports.modifierTankHistory = async (req, res) => {
  try {
    const history = await TankHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!history) return res.status(404).json({ message: "Historique introuvable" });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(400).json({ message: "Erreur lors de la mise à jour", error });
  }
};

// Supprimer un historique
exports.supprimerTankHistory = async (req, res) => {
  try {
    const deleted = await TankHistory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Historique introuvable" });
    return res.status(200).json({ message: "Historique supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};

exports.getTankById = async (req, res) => {

  try {
    const tank = await Tank.findById(req.params.id);

    if (!tank) {
      return res.status(404).json({ message: "Tank non trouvé" });
    }

    return res.status(200).json(tank);
  } catch (err) {
    console.error("❌ Erreur récupération tank :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du tank" });
  }
};

exports.getHistoriesByTankAndProduct = async (req, res) => {
  try {
    const { tankId, productId } = req.params;

    const histories = await TankHistory.find({
      tankId,
      product: productId,
    }).sort({ timestamp: -1 }); // du plus récent au plus ancien
    
    return res.json(histories);
  } catch (error) {
    console.error("❌ Erreur récupération des historiques tank+produit :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des historiques du tank pour ce produit",
      error,
    });
  }
};

exports.getEveryTanksLastLevel = async (req, res) => {
  try {
    const userId = req.params.user;

    if (!userId) {
      return res.status(400).json({ error: "userId requis" });
    }

    // Récupérer les fermes liées à cet utilisateur
    const farmIds = await Farm.find({ owner: { $in: [userId] } }).select("_id");
    if (!farmIds.length) {
      return res.status(200).json({});
    }

    // Récupérer les tanks liés à ces fermes
    const tanks = await Tank.find({ linkedFarm: { $in: farmIds } }).select("_id");
    if (!tanks.length) {
      return res.status(200).json({});
    }

    const tankIds = tanks.map(t => t._id);

    // Récupérer le dernier relevé de chaque tank
    const histories = await TankHistory.aggregate([
      { $match: { tankId: { $in: tankIds } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$tankId",
          lastLevel: { $first: "$newLevel" },
        },
      },
    ]);
    // 🔹 4) Reformater en objet : { tankId: lastLevel }
    const result = {};
    histories.forEach(h => {
      result[h._id] = h.lastLevel ?? 0;
    });

    return res.status(200).json(result);

  } catch (error) {
    console.error("Erreur getEveryTanksLastLevel :", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des niveaux de tanks",
      error,
    });
  }
};



