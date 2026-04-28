const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true }, //à suprrimer car redondant
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: {type: String, required: true},
  message: { type: String, required: true },
  temperature: Number,
  humidity: Number,
  ph: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);


