const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

// Lister tous les capteurs
router.get('/', sensorController.afficherLesCapteurs);

// Créer un capteur
router.post('/', sensorController.creerCapteur);

// Récupérer un capteur par son ID
router.get('/:id', sensorController.afficherUnCapteur);

// Modifier un capteur
router.put('/:id', sensorController.modifierCapteur);

// Supprimer un capteur
router.delete('/:id', sensorController.supprimerCapteur);

//Récuperer un capteur appartenant à une ferme
router.get('/product/:productId', sensorController.getSensorsByProduct);

router.get('/farm/:farmId', sensorController.getSensorsByFarm);

router.get('/user/:user',sensorController.getSensorsByUser);
module.exports = router;
