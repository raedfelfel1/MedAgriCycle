const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
  sensor_id: { type: String, required: true, unique: true },
  location: {
    latitude: { type: String, default:null },
    longitude: { type: String, default:null }
  },
  installed_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product',default:null},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',default:null} 
});

module.exports = mongoose.model('Sensor', SensorSchema);
