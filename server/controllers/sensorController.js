const Sensor = require("../models/Sensor");
const mongoose = require("mongoose");

// Lister tous les capteurs
exports.afficherLesCapteurs = async (req, res) => {
  try {
    const capteurs = await Sensor.find();
    res.status(200).json(capteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un capteur 
exports.creerCapteur = async (req, res) => {
  try {
    
    const { sensor_id } = req.body;
    // Validation basique
    if (!sensor_id) {
      return res.status(400).json({ message: "Champs requis manquants : sensor_id" });
    }
    
    const nouveauCapteur = new Sensor({
      sensor_id,
    });

    const capteurCree = await nouveauCapteur.save();
    return res.status(201).json(capteurCree);
  } catch (err) {
    // Gestion des erreurs Mongo (ex: sensor_id unique)
    if (err.code === 11000) {
      return res.status(400).json({ message: "sensor_id déjà utilisé" });
    }
    return res.status(500).json({ message: err.message });
  }
};


// Récupérer un capteur par son ID
exports.afficherUnCapteur = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de capteur invalide" });
    }

    const capteur = await Sensor.findById(id);

    if (!capteur) {
      return res.status(404).json({ message: "Capteur non trouvé" });
    }

    return res.status(200).json(capteur);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// for dataSensorController
exports.getSensorByName=async (name) =>{ // name but actually the field name is sensor_id
  try{
    const sensor = await Sensor.findOne({sensor_id:name})
    console.log(sensor)
    if(sensor){
      return sensor
    }
  }
  catch(err){
    return res.status(500).json({message:err.message});
  }
}
// Modifier un capteur
exports.modifierCapteur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de capteur invalide" });
    }

    const capteurMisAJour = await Sensor.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!capteurMisAJour) {
      return res.status(404).json({ message: "Capteur non trouvé" });
    }

    return res.status(200).json(capteurMisAJour);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Supprimer un capteur
exports.supprimerCapteur = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de capteur invalide" });
    }

    const capteurSupprime = await Sensor.findByIdAndDelete(id);

    if (!capteurSupprime) {
      return res.status(404).json({ message: "Capteur non trouvé" });
    }

    return res.status(200).json({
      message: "Capteur supprimé avec succès",
      capteur: capteurSupprime
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getSensorsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'ID de ferme invalide' });
    }

    const sensors = await Sensor.find({ product: productId });

    return res.json({
      success: true,
      count: sensors.length,
      data: sensors
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

//Récuperer des capteurs appartenant à une ferme
exports.getSensorsByFarm = async (req, res) => {
  try {
    console.log("test")
    const { farmId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(farmId)) {
      return res.status(400).json({ message: 'ID de ferme invalide' });
    }

    const sensors = await Sensor.find()
      .populate({
        path: 'product',
        match: { farm: farmId }
      })

      const sensorsFromFarm = sensors.filter(
        sensor => sensor.product !== null
      );

    console.log("id : ",farmId)
    console.log("resultat : ",sensorsFromFarm)
    return res.json({
      success: true,
      count: sensorsFromFarm.length,
      data: sensorsFromFarm
    });

  } catch (err) {
    console.error("erreur requete : ",err.message)
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

exports.getSensorsByUser = async(req,res)=>{
  try{
    console.log("getSensorsByUser");
    const{user}=req.params;
    if(!mongoose.Types.ObjectId.isValid(user)){
      return res.status(404).json({message:'invalid User ID'})
    }
    const sensors = await Sensor.find({user:user})
    console.log(sensors);
    return res.json({
      success:true,
      count:sensors.length,
      data:sensors
    })
  }catch (err) {
    console.error("erreur requete : ",err.message)
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}