const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Lister tous les utilisateurs
router.get('/', userController.afficherLesUtilisateurs);

// Créer un utilisateur
router.post('/', userController.creerUtilisateur);

// Connexion
router.post('/login', userController.authentifierUtilisateur);

// Mot de passe oublié
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Vérification email
router.get('/verify-email/:token', userController.verifyEmail);

// Récupérer un utilisateur par son ID
router.get('/:id', userController.afficherUnUtilisateur);

// Modifier un utilisateur
router.put('/:id', userController.modifierUtilisateur);

// Changer le mot de passe
router.put('/:id/password', userController.changerMotDePasse);

// Supprimer un utilisateur
router.delete('/:id', userController.supprimerUtilisateur);

module.exports = router;