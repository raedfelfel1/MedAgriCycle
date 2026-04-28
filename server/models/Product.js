const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true, default: Date.now },
  name: { type: String, required: true },
  plant: { type: String }, 
  category: { type: String, required: true },
  // à enlever
  minTemperature: { type: Number },
  maxTemperature: { type: Number },
  minHumidite: { type: Number },
  maxHumidite: { type: Number },
  minPh: { type: Number },
  maxPh: { type: Number },
  // 
  farm: { type: mongoose.Schema.Types.ObjectId, ref: "Farm", required: true },
  waterTank: { type: mongoose.Schema.Types.ObjectId, ref: "Tank", default: null },
  fertilizerTank: { type: mongoose.Schema.Types.ObjectId, ref: "Tank", default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
