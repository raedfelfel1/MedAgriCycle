const express = require('express');
const productController = require("../controllers/productController");
const router = express.Router();

// Créer un produit
router.post('/', productController.creerProduit);

router.get('/productsAndFarms', productController.getProductAndFarmsByUser)

// Lister tous les produits (optionnel - pour admin ou debug)
router.get('/', productController.afficherTousLesProduits);

// Lister les produits d'une ferme spécifique (ex: /farm/:farmId)
router.get('/farm/:farmId', productController.afficherLesProduitsParFerme);

// Afficher un produit par ID
router.get('/:id', productController.afficherProduitParId);

router.get('/user/:id', productController.getProductsByUserId);

// Mettre à jour un produit
router.put('/:id', productController.mettreAJourProduit);

// Supprimer un produit
router.delete('/:id', productController.supprimerProduit);

module.exports = router;
