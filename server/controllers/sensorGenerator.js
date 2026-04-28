
const SensorData = require('../models/SensorData');
const fs = require("fs");
const path = require("path");
const INTERVAL_MS = 2000; // toutes les 5s

function randomDelta(maxDelta) {
  return (Math.random() - 0.5) * 2 * maxDelta;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Valeurs initiales
let lastValues = {
  temperature: 25,
  humidity: 60,
  ph: 7.5,
};

// Génération réaliste
function generateSensorData() {
  const specs = {
    temperature: { min: 15, max: 35, delta: 0.5 },
    humidity: { min: 30, max: 90, delta: 2 },
    ph: { min: 6.5, max: 8.5, delta: 0.05 },
    conductivity: { min: 5, max: 9, delta: 0.3 },

  };

  Object.keys(specs).forEach(key => {
    const { min, max, delta } = specs[key];
    lastValues[key] = clamp(lastValues[key] + randomDelta(delta), min, max);
  });

  return {
    temperature: Number(lastValues.temperature.toFixed(2)),
    humidity: Number(lastValues.humidity.toFixed(2)),
    ph: Number(lastValues.ph.toFixed(2)),
  };
}

exports.startAutoGeneration = async (io, productId) => {
  try {
    const now = new Date();
    const start = new Date(now.getTime() - 24 * 60 * 60 * 1000); // il y a 24h
    const docs = [];

    for (let i = 0; i < 24 * 60; i++) {
      const ts = new Date(start.getTime() + i * 60 * 1000); // + i minutes
      const values = generateSensorData();

      const data = {
        sensor: '698ef738241c007888736ec8',
        timestamp: ts,
        ...values,
      };

      docs.push(data);
      io.to(productId).emit("sensorData", data);
    }
    await SensorData.insertMany(docs);
    console.log("✅✅✅✅✅✅✅✅✅✅✅✅✅✅");
  } catch (err) {
    console.error("❌❌❌❌❌❌❌❌❌❌❌❌", err.message);
  }
};

exports.startAutoGeneration24h = async (io, productId) => {
  try {
    setInterval(() => {
    const values = generateSensorData();
    const data = {
      product: productId,
      timestamp: new Date(),
      ...values,
    };
    io.to(productId).emit("sensorData", data);
  }, INTERVAL_MS);

    await SensorData.create(data);
  } catch (err) {
    console.error("❌❌❌❌❌❌❌❌❌❌❌❌", err.message);
  }
};

exports.importSensorData = async () => {
  try {
    const sensorId = "698ef738241c007888736ec8"; // ID du capteur cible

    // 🔥 Chemin vers le fichier data.json
    const filePath = path.join(__dirname, "..", "data", "data.json");

    // 🔥 Lecture du fichier
    const fileContent = fs.readFileSync(filePath, "utf8");

    // 🔥 Parsing du JSON
    const jsonData = JSON.parse(fileContent);

    if (!Array.isArray(jsonData)) {
      return
    }

    // 🔥 Formatage des données pour insertion
    const formattedData = jsonData.map(entry => ({
      sensor: sensorId,
      temperature: entry.temperature || null,
      humidity: entry.humidity || null,
      ph: entry.ph || null,
      timestamp: entry.date ? new Date(entry.date) : new Date()
    }));

    await SensorData.insertMany(formattedData);

  } catch (error) {
    console.error("❌ Erreur import JSON :", error);
  }
};