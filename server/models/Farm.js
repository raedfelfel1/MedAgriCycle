const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema({
  id: { type: Number, unique: true, default: Date.now },

  name: { type: String, required: true },

  location:{
    type:String,require:true
  },

  createdAt: { type: Date, default: Date.now },
  area: { type: Number }, // superficie (hectares, m²...)

  // Référence vers le propriétaire (utilisateur)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("Farm", FarmSchema);
