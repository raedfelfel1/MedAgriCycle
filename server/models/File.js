const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },   // nom original ou personnalisé
  contentType: { type: String, required: true }, // type MIME (ex: application/pdf)
  uploadDate: { type: Date, default: Date.now }, // date d’upload
  metadata: { type: Object }, // infos supplémentaires (ex: farmId, userId…)
});

module.exports = mongoose.model("File", FileSchema);
