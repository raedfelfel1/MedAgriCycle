const express = require('express');
const router = express.Router();
const farmController = require("../controllers/farmController");
const auth = require("../middleware/auth");

// Lister toutes les fermes
router.get('/', farmController.afficherLesFermes);

// Créer une nouvelle ferme (protégé par JWT)
router.post('/', auth, farmController.creerFerme);

// Supprimer une ferme par son ID (protégé par JWT)
router.delete('/:id', auth, farmController.supprimerFerme);

// Modifier une ferme par son ID (protégé par JWT)
router.put('/:id', auth, farmController.modifierFerme);

// Récupérer une ferme spécifique par son ID (optionnel)
router.get('/:id', farmController.afficherFermesParUtilisateur);

// Lister toutes les fermes d'un utilisateur donné
router.get('/user/:userId', farmController.afficherFermesParUtilisateur);

module.exports = router;
