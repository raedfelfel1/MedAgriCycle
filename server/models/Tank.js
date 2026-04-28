const mongoose = require("mongoose");

const TankSchema = new mongoose.Schema({
  linkedFarm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farm", // clé étrangère vers la ferme
    required: true,
  },
  name: {
    type: String,
    required: true, // Nom du réservoir
  },
  type: {
    type: String,
    enum: ["water", "fertilizer","water_fertilizer"],
    required: true, // Type général du réservoir
  },
  liquidType: {
    type: String,
    required: true, // Type spécifique (eau douce, azote, etc.)
    // enum: [
    //   "eau douce",
    //   "eau de pluie",
    //   "eau recyclée",
    //   "eaux usées",
    //   "azote",
    //   "phosphate",
    //   "potassium",
    //   "organique",
    // ],
  },
  capacity: {
    type: Number,
    required: true, // Capacité maximale en litres
  },
  unit: {
    type: String,
    default: "L", // unité
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Tank", TankSchema);
