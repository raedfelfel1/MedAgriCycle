const express = require("express");
const router = express.Router();
const tankHistoryController = require("../controllers/tankHistoryController");

// Récupérer tous les historiques de consommation
router.get("/", tankHistoryController.afficherLesTankHistories);

router.get("/getTank/:id", tankHistoryController.getTankById);

// Créer un nouvel historique de consommation
router.post("/", tankHistoryController.creerTankHistory);

// Récupérer un historique spécifique par ID
router.get("/:id", tankHistoryController.afficherUnTankHistory);

// Récupérer les historiques liés à un tank spécifique
router.get("/tank/:tankId", tankHistoryController.getHistoriesByTank);

// Récupérer les historiques liés à un produit spécifique
router.get("/product/:productId", tankHistoryController.getHistoriesByProduct);

// Modifier un historique
router.put("/:id", tankHistoryController.modifierTankHistory);

// Récypérer derniere relevé d'un tank
router.get("/lastTankHistory/:tankId", tankHistoryController.getLastTankHistory);

// Supprimer un historique
router.delete("/:id", tankHistoryController.supprimerTankHistory);

router.get("/tank/:tankId/product/:productId", tankHistoryController.getHistoriesByTankAndProduct);

router.get("/everyTanksLastLevel/:user", tankHistoryController.getEveryTanksLastLevel);

module.exports = router;
