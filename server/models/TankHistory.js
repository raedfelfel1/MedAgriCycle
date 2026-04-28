const mongoose = require("mongoose");

const TankHistorySchema = new mongoose.Schema({
  tankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tank",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  action: {
    type: String,
    enum: ["fill", "irrigate", "fertilize", "empty", "maintenance","water_fertilizer"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true, // Quantité d’eau ou de fertilisant utilisée/remplie
  },
  newLevel: {
    type: Number, // Niveau après l’action
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TankHistory", TankHistorySchema);
