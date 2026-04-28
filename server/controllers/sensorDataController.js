const SensorData = require("../models/SensorData");
const mongoose = require("mongoose");
const { getSensorByName } = require("./sensorController");
const Sensor = require("../models/Sensor");

// Historique des relevés d’un capteur
exports.getSensorHistory = async (req, res) => {
  try {
    let hours;
    const { sensorId } = req.params;

    let results = [];
    if(req.query.hours==="live"){
      hours="live"
    }else{
      hours = parseInt(req.query.hours) || 24;
    }             
    console.log("hours :",hours)  
    const aggregation = req.query.aggregation || "hourly"; // hourly, daily, weekly, live

    // ============================================
    //  LIVE MODE — aucune autre logique exécutée
    // ============================================
    if (aggregation === "live") {
      console.log("last1")
      const last = await SensorData.findOne({ sensor: sensorId }).sort({ timestamp: -1 });
      console.log("last2",last)
      if (!last) return res.json([]);

      results=([
        {
          timestamp: last.timestamp,
          temperature: last.temperature ?? 0,
          humidity: last.humidity ?? 0,
          ph: last.ph ?? 0,
          conductivity: last.conductivity ?? 0,

        }
      ]);
      console.log("results.json : ",results)
          }else{

    // ============================================
    //  MODES HOUR / DAILY / WEEKLY (besoin de latest)
    // ============================================

    const latest = await SensorData.findOne({ sensor: sensorId }).sort({ timestamp: -1 });
    if (!latest) return res.json([]);

    const end = new Date(latest.timestamp);
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);

    // =============== HOURLY ======================
    if (aggregation === "hourly") {
      for (let i = 0; i < hours; i++) {
        const ts = new Date(end.getTime() - i * 60 * 60 * 1000);

        const windowStart = new Date(ts.getTime() - 30 * 60 * 1000);
        const windowEnd = new Date(ts.getTime() + 30 * 60 * 1000);

        const points = await SensorData.find({
          sensor: sensorId,
          timestamp: { $gte: windowStart, $lt: windowEnd },
        });

        const avg = (arr, key) =>
          arr.length
            ? arr.reduce((sum, p) => sum + (p[key] || 0), 0) / arr.length
            : 0;

        results.push({
          timestamp: ts,
          temperature: avg(points, "temperature"),
          humidity: avg(points, "humidity"),
          ph: avg(points, "ph"),
          conductivity: avg(points, "ph"),

        });
      }

      results.reverse();
    }

    // =============== DAILY ======================
    else if (aggregation === "daily") {
      results = await SensorData.aggregate([
        {
          $match: {
            sensor: new mongoose.Types.ObjectId(sensorId),
            timestamp: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            timestamp: { $first: "$timestamp" },
            temperature: { $avg: "$temperature" },
            humidity: { $avg: "$humidity" },
            ph: { $avg: "$ph" },
            conductivity: { $avg: "$conductivity" },
          },
        },
        { $sort: { timestamp: 1 } },
      ]);
    }

    // =============== WEEKLY ======================
    else if (aggregation === "weekly") {
      results = await SensorData.aggregate([
        {
          $match: {
            sensor: new mongoose.Types.ObjectId(sensorId),
            timestamp: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: { $week: "$timestamp" },
            timestamp: { $first: "$timestamp" },
            temperature: { $avg: "$temperature" },
            humidity: { $avg: "$humidity" },
            ph: { $avg: "$ph" },
            conductivity: { $avg: "$conductivity" },
          },
        },
        { $sort: { timestamp: 1 } },
      ]);
    }
  }

    return res.json(results);
    console.log("res.json : ",res.json(results))
  } catch (err) {
    console.error("Erreur /history/:sensorId :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET: récupère les 5 dernières valeurs
exports.liveInit = async (req, res) => {
  try {
    const sensorId = req.params.id;

    const data = await SensorData.find({ sensorId })
      .sort({ timestamp: -1 })
      .limit(5); // ⬅️ récupère les 5 dernières valeurs

    return res.json(data); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur live-init" });
  }
};



exports.addData = async (req, res) => {
  // console.log("test",req.body)
  try {
    const { measurements,device} = req.body;
    const {ec,ph,soil1_temp,soil1_hum,air_temp,air_hum}= measurements
    const sensor = await getSensorByName(device)

    if(!sensor){
      const newSensor = new Sensor({
        sensor_id: device,
      })
      await newSensor.save();
      return res.status(201).json(newSensor);
      // return res.status(404).json({message:"not found"})
    }
    else if(!sensor.product){
      return res.status(202).json({message:"No linked product found"})
    }
    // console.log("Sensor : ",sensor)
    // console.log("temperature : ",temperature)
    // console.log("humidity : ",humidity)
    // console.log("ph : ",ph)
    // console.log("conductivity : ",conductivity)
    const newData = new SensorData({
      sensor:sensor._id,
      temperature:soil1_temp || air_temp,
      humidity:soil1_hum || air_hum,
      ph:ph,
      conductivity:ec,
      timestamp: Date.now()
    });
    await newData.save();

    return res.status(201).json(newData);
  } catch (err) {
    return res.status(400).json({ error: 'Erreur lors de la création de la donnée.' });
  }
};

exports.fetchSensorHistory = async (req,res) =>{
    const { sensorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sensorId)) {
      return res.status(400).json({ message: 'sensor id not found' });
    }
    try {
      const data = await SensorData.find({sensor:sensorId})
      return res.status(201).json(data);
    } catch (error) {
      return res.status(500).json({message: "Server error"})
    }
}