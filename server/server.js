// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialisation de l'app
const app = express();
app.use(cors({
  origin:'*',
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serveur HTTP + Socket.IO
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});



// Routes
const farmRoute = require('./routes/farmRoute');
const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const sensorRoute = require('./routes/sensorRoute');
const sensorDataRoute = require('./routes/sensorDataRoute');
const authRoute = require('./routes/authRoute');
const recomRoute=require('./routes/recommendationRoute');
const uploadRoutes = require('./routes/uploadRoutes');
const fileRoutes = require("./routes/fileRoute");
const tankRoute = require("./routes/tankRoute");
const tankHistoryRoute = require("./routes/tankHistoryRoute");



// Connexion MongoDB
console.log("🥁 tentative de connexion")
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("✅ Connecté à la base de données MongoDB")
  // Lancer serveur
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé avec Socket.IO sur le port ${PORT}`);
  });
})
.catch((err) => console.error("❌ Erreur de connexion à MongoDB :", err));

// Routes API
app.use('/api/farms', farmRoute);
app.use('/api/products', productRoute);
app.use('/api/users', userRoute);
app.use('/api/sensors', sensorRoute);
app.use('/api/sensors-data', sensorDataRoute);
app.use('/api/auth', authRoute);
app.use('/api/recommendations', recomRoute);
app.use("/api/files", fileRoutes);
app.use("/api/tanks", tankRoute);
app.use("/api/tankHistory",tankHistoryRoute);


// Middleware pour servir les fichiers dans uploads en statique
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utiliser la route upload
app.use('/api/images', uploadRoutes);



app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de l\'agriculture intelligente 🌱');
});


// Socket.IO
io.on('connection', (socket) => {
  console.log("🟢 Nouveau client connecté via WebSocket!");
  
  socket.on('setProductId', (productId) => {
    if (!productId) {
      console.log("⚠️ productID vide ou null reçu, on ignore");
      return;
    }

    console.log(`🌱 productId reçu pour ce client : ${productId}`);
    socket.productId = productId;

    // ✅ ajoute ce socket dans une "room" spécifique à la ferme
    socket.join(productId);

    // 🔹 Lancer la génération pour cette ferme
    // importSensorData(socket,productId)
  });
  
  socket.on('disconnect', () => {
    console.log("🔴 Client déconnecté!");
  });
});


function getFarmIdsConnected() {
  const farmIds = [];
  io.sockets.sockets.forEach(socket => {
    if (socket.farmId) farmIds.push(socket.farmId);
  });
  return farmIds;
}



// Démarrer la génération de données avec transmission via WebSocket
const { startAutoGeneration, startAutoGeneration24h,importSensorData } = require('./controllers/sensorGenerator');
const state = require('./services/state');

 





//  data generate
const SensorData = require("./models/SensorData");
const sensorId = "698ef738241c007888736ec8";
function generateSensorData() {
  return {
    sensor: sensorId,
    temperature: Number((15 + Math.random() * 25).toFixed(3)),       // 15 → 40 °C
    humidity: Number(((30 + Math.random() * 50) / 100).toFixed(3)),  // 0.3 → 0.8
    ph: Number((1 + Math.random() * 13).toFixed(1)),                  // 6 → 8
    conductivity: Number((50 + Math.random() * 100).toFixed(3)),     // 50 → 150 µS/cm
    timestamp: new Date(),
  };
}

async function insertData() {
  try {
    const data = generateSensorData();
    await SensorData.create(data);
    console.log("✅ Donnée insérée :", data);
  } catch (err) {
    console.error("❌ Erreur insertion :", err);
  }
}

// 🔁 Toutes les 2 minutes (2*60*1000=120 000 ms)
// setInterval(()=>insertData(), 0.5*60*1000);

// Optionnel : insérer immédiatement au démarrage
// insertData();