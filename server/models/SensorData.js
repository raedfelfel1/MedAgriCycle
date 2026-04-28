const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true }, 
  temperature: Number,
  humidity: Number,
  ph: Number,
  conductivity: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
