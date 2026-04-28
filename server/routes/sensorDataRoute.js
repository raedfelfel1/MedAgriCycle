const express = require("express");
const sensorDataController = require('../controllers/sensorDataController');

const router = express.Router();

// Historique des relevés d’un capteur
router.get("/history/:sensorId", sensorDataController.getSensorHistory)

// GET: récupère les 5 dernières valeurs
router.get("/history/liveInit/:id", sensorDataController.liveInit)

router.post('/addData',sensorDataController.addData)

router.get("/history/v2/:sensorId",sensorDataController.fetchSensorHistory)
module.exports = router;