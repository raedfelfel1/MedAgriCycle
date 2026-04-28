const Tank = require("../models/Tank");
const Product = require("../models/Product")

exports.createTank = async (req, res) => {
  try {
    const tank = await Tank.create(req.body);
    res.status(201).json(tank);
  } catch (err) {
    console.error("❌ Erreur création tank:", err.message);
    res.status(500).json({ message: "Erreur création tank", error: err.message });
  }
};

exports.getTanks = async (req, res) => {
  try {
    const tanks = await Tank.find();
    return res.json(tanks);
  } catch (err) {
    return res.status(500).json({ message: "Erreur lecture tanks", error: err.message });
  }
};

exports.getTankById = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);

    if (!tank) {
      return res.status(404).json({ message: "Tank non trouvé" });
    }

    res.status(200).json(tank);
  } catch (err) {
    console.error("❌ Erreur récupération tank :", err);
    return res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération du tank" });
  }
};

exports.updateTank = async (req, res) => {
  try {
    const tank = await Tank.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(tank);
  } catch (err) {
    return res.status(500).json({ message: "Erreur update tank", error: err.message });
  }
};

exports.deleteTank = async (req, res) => {
  try {
    await Tank.findByIdAndDelete(req.params.id);
    return res.json({ message: "Tank supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ message: "Erreur suppression tank", error: err.message });
  }
};

exports.fetchTanksByFarm = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "farmId manquant" });
    }

    const tanks = await Tank.find({ linkedFarm: id })
    // populate si tu veux les infos du produit lié

    if (!tanks || tanks.length === 0) {
      return res.status(404).json({ message: "Aucun tank trouvé pour cette ferme" });
    }

    return res.status(200).json(tanks);
  } catch (error) {
    console.error("❌ Erreur getTanksByFarm:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la récupération des tanks" });
  }
};

exports.updateTankName = async (req, res) => {
  try {
    const tankId = req.params.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom est requis" });
    }

    const updatedTank = await Tank.findByIdAndUpdate(
      tankId,
      { name },
      { new: true }
    );

    if (!updatedTank) {
      return res.status(404).json({ message: "Tank introuvable" });
    }

    return res.status(200).json({ message: "Nom du tank mis à jour", tank: updatedTank });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getProductsByTank = async (req, res) => {
  try {
    const tankId = req.params.tankId;

    const products = await Product.find({
      $or: [
        { waterTank: tankId },
        { fertilizerTank: tankId }
      ]
    });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la récupération des produits liés au tank",
      error,
    });
  }
};

// récupérer les tanks d'un utilisateur
exports.getTanksByUser=async(req,res)=>{
  try{
    const userId=req.params.userId;
    const tanks=await Tank.find()
    .populate({
      path:"linkedFarm",
      match:{owner: userId},
    });
    const filteredTanks=tanks.filter(tank=>tank.linkedFarm);
    res.status(200).json(filteredTanks);
  }catch(error){
    res.status(500).json({message:error.message});
  }
};
