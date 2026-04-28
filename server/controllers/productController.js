const Product = require("../models/Product");
const Farm = require('../models/Farm');
const mongoose = require("mongoose");

// Créer un produit associé à une ferme (déjà existant)
// Créer un produit associé à une ferme
exports.creerProduit = async (req, res) => {
  try {
    const { name, plant, category, farm } = req.body;

    if (!name || !category || !farm) {
      return res.status(400).json({ message: "Nom, catégorie et ferme sont obligatoires" });
    }

    if (!mongoose.Types.ObjectId.isValid(farm)) {
      return res.status(400).json({ message: "ID de ferme invalide" });
    }

    const farmExists = await Farm.findById(farm);
    if (!farmExists) {
      return res.status(404).json({ message: "Ferme non trouvée" });
    }

    const newProduct = new Product({
      name,
      plant: plant || null, 
      category,
      minTemperature: req.body.minTemperature,
      maxTemperature: req.body.maxTemperature,
      minHumidite: req.body.minHumidite,
      maxHumidite: req.body.maxHumidite,
      minPh: req.body.minPh,
      maxPh: req.body.maxPh,
      farm,
      waterTank: req.body.waterTank,
      fertilizerTank: req.body.fertilizerTank,
      createdAt: new Date(),
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


// Afficher tous les produits (sans filtre)
exports.afficherTousLesProduits = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Afficher les produits par ferme (filtrer par req.params.farmId)
exports.afficherLesProduitsParFerme = async (req, res) => {
  try {
    const { farmId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({ message: 'ID de ferme invalide' });
    }

    const products = await Product.find({ farm: farmId });

    return res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Afficher un produit par son ID
exports.afficherProduitParId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    return res.json({
      success: true,
      data: product
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.getProductsByUserId = async (req,res)=>{
  const {id}=req.params;
  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({message:"invalid user id"})
  }
  try {
    const farmsIds = (await Farm.find({owner:id}).select('_id'))
    const products = await Product.find({farm:{$in:farmsIds}})
    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: error.message });
    
  }
}
// Mettre à jour un produit
exports.mettreAJourProduit = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de produit invalide" });
    }

    if (req.body.farm && !mongoose.Types.ObjectId.isValid(req.body.farm)) {
      return res.status(400).json({ message: "ID de ferme invalide" });
    }

    if (req.body.farm) {
      const farmExists = await Farm.findById(req.body.farm);
      if (!farmExists) {
        return res.status(404).json({ message: "Ferme non trouvée" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    return res.json({
      success: true,
      message: "Produit mis à jour",
      data: updatedProduct,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Supprimer un produit par son ID (déjà existant)
exports.supprimerProduit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de produit invalide' });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    return res.json({
      success: true,
      message: 'Produit supprimé avec succès',
      data: deletedProduct
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getProductAndFarmsByUser= async (req, res) => {
  const { user } = req.query;
  try {
    // 1. Trouver les fermes associées à l'utilisateur
    const farms = await Farm.find({ owner: user });

    if (!farms || farms.length === 0) {
      return res.status(404).json({ message: "Aucune ferme trouvée pour cet utilisateur." });
    }

    // 2. Trouver les produits associés à ces fermes
    const farmIds = farms.map(farm => farm._id);
    const products = await Product.find({ farm: { $in: farmIds } });

    // 3. Retourner les résultats
    res.status(200).json({
      farms,
      products
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
