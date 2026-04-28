// controllers/recommendationController.js
const Product = require('../models/Product');
const SensorData = require('../models/SensorData');
const Sensor = require('../models/Sensor');
const Recommendation = require('../models/Recommendation');
const Farm = require('../models/Farm')
const state = require('../services/state');
const mongoose = require('mongoose');

// Mistral AI API
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY; // Clé API Mistral stockée en variable d'environnement



exports.generateRecommendations = async (req, res) => {
  try {
    console.log("dans generate")

    const { farmId } = req.body;
    const lang = req.query.lang || 'en-US'; // si tu l’envoies en query string ?lang=f
    console.log("langue : ", lang)
    console.log("langue2 : ", req.query.lang)
    if (!farmId) return res.status(400).json({ error: 'farmId requis' });

    state.setFarmId(farmId);

    const products = await Product.find({ farm: farmId });
    console.log("dans generate2")
    if (!products.length) {
      console.log("erreur1")
      res.status(404).json({ error: 'Aucune culture trouvée pour cette ferme' });
      return
    }

    const recommendations = [];
    console.log("Génération de recommandations pour", products.length, "produits");

    for (const product of products) {
      try {
        // Récupérer les capteurs liés à ce produit
        const sensors = await Sensor.find({ product: product._id });

        let avgTemperature, avgHumidity, avgPh;
        let usingPlaceholder = false;

        if (!sensors || sensors.length === 0) {
          console.log(`⚠️ Aucun capteur trouvé pour le produit ${product.name}, utilisation de valeurs par défaut`);
          usingPlaceholder = true;

          // Utiliser les valeurs optimales basées sur les seuils du produit
          // Si les seuils sont définis, utiliser le milieu de la plage
          // Sinon, utiliser des valeurs par défaut réalistes
          if (product.minTemperature && product.maxTemperature) {
            avgTemperature = ((parseFloat(product.minTemperature) + parseFloat(product.maxTemperature)) / 2).toFixed(1);
          } else {
            avgTemperature = "22.0"; // Température par défaut
          }

          if (product.minHumidite && product.maxHumidite) {
            avgHumidity = ((parseFloat(product.minHumidite) + parseFloat(product.maxHumidite)) / 2).toFixed(1);
          } else {
            avgHumidity = "60.0"; // Humidité par défaut
          }

          if (product.minPh && product.maxPh) {
            avgPh = ((parseFloat(product.minPh) + parseFloat(product.maxPh)) / 2).toFixed(2);
          } else {
            avgPh = "6.5"; // pH par défaut
          }

          console.log(`📊 Valeurs par défaut pour ${product.name}: Temp=${avgTemperature}°C, Humidité=${avgHumidity}%, pH=${avgPh}`);
        } else {
          // Récupérer les dernières données de capteur pour chaque capteur
          // On prend la moyenne des dernières données de tous les capteurs du produit
          let totalTemp = 0, totalHumidity = 0, totalPh = 0;
          let count = 0;

          for (const sensor of sensors) {
            const latestData = await SensorData.findOne({ sensor: sensor._id })
              .sort({ timestamp: -1 });

            if (latestData) {
              totalTemp += latestData.temperature || 0;
              totalHumidity += latestData.humidity || 0;
              totalPh += latestData.ph || 0;
              count++;
            }
          }

          if (count === 0) {
            console.log(`⚠️ Aucune donnée de capteur trouvée pour le produit ${product.name}, utilisation de valeurs par défaut`);
            usingPlaceholder = true;

            // Utiliser les valeurs optimales basées sur les seuils du produit
            if (product.minTemperature && product.maxTemperature) {
              avgTemperature = ((parseFloat(product.minTemperature) + parseFloat(product.maxTemperature)) / 2).toFixed(1);
            } else {
              avgTemperature = "22.0";
            }

            if (product.minHumidite && product.maxHumidite) {
              avgHumidity = ((parseFloat(product.minHumidite) + parseFloat(product.maxHumidite)) / 2).toFixed(1);
            } else {
              avgHumidity = "60.0";
            }

            if (product.minPh && product.maxPh) {
              avgPh = ((parseFloat(product.minPh) + parseFloat(product.maxPh)) / 2).toFixed(2);
            } else {
              avgPh = "6.5";
            }

            console.log(`📊 Valeurs par défaut pour ${product.name}: Temp=${avgTemperature}°C, Humidité=${avgHumidity}%, pH=${avgPh}`);
          } else {
            // Calculer les moyennes des données réelles
            avgTemperature = (totalTemp / count).toFixed(1);
            avgHumidity = (totalHumidity / count).toFixed(1);
            avgPh = (totalPh / count).toFixed(2);

            console.log(`✅ Données réelles pour ${product.name}: Temp=${avgTemperature}°C, Humidité=${avgHumidity}%, pH=${avgPh}`);
          }
        }

        // Déterminer la langue
        let langue;
        if (lang === 'en-US') {
          langue = "anglais";
        } else if (lang === "fr-FR") {
          langue = "Français";
        } else {
          langue = "anglais"; // Par défaut
        }

        // Créer le prompt pour Mistral AI
        const dataSource = usingPlaceholder
          ? "Note: Ces valeurs sont des estimations basées sur les seuils recommandés pour cette culture, car aucun capteur n'est actuellement connecté."
          : "Ces valeurs proviennent de capteurs en temps réel.";

        const thresholdsInfo = [];
        if (product.minTemperature && product.maxTemperature) {
          thresholdsInfo.push(`Température recommandée: ${product.minTemperature}°C - ${product.maxTemperature}°C`);
        }
        if (product.minHumidite && product.maxHumidite) {
          thresholdsInfo.push(`Humidité recommandée: ${product.minHumidite}% - ${product.maxHumidite}%`);
        }
        if (product.minPh && product.maxPh) {
          thresholdsInfo.push(`pH recommandé: ${product.minPh} - ${product.maxPh}`);
        }

        const thresholdsText = thresholdsInfo.length > 0
          ? `\n\nSeuils recommandés pour cette culture:\n${thresholdsInfo.join('\n')}`
          : '';

        const prompt = `Tu es un expert en agriculture. Donne-moi une recommandation détaillée et pratique pour la culture "${product.plant || product.name}" avec les conditions suivantes :
- Température actuelle : ${avgTemperature}°C
- Humidité actuelle : ${avgHumidity}%
- pH du sol actuel : ${avgPh}

${dataSource}${thresholdsText}

Analyse ces conditions par rapport aux seuils recommandés et donne des conseils concrets pour optimiser la croissance de cette culture. Si les valeurs actuelles sont en dehors des seuils recommandés, suggère des actions correctives. Rédige en ${langue} de manière claire et structurée. Réponds en Markdown SANS entourer la réponse par \`\`\`markdown\`\`\` ou \`\`\`\``;

        // Appel à l'API Mistral AI
        if (!MISTRAL_API_KEY) {
          throw new Error('MISTRAL_API_KEY non configurée dans les variables d\'environnement');
        }

        const response = await fetch(MISTRAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistral-medium', // ou 'mistral-small', 'mistral-large' selon vos besoins
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Erreur API Mistral: ${response.status} - ${errorText}`);
          throw new Error(`Erreur API Mistral: ${response.status}`);
        }

        const data = await response.json();
        const message = data.choices?.[0]?.message?.content || 'Aucune recommandation disponible';

        // Créer et sauvegarder la recommandation
        const rec = new Recommendation({
          farm: farmId,
          product: product._id,
          productName: product.name,
          message,
          temperature: parseFloat(avgTemperature),
          humidity: parseFloat(avgHumidity),
          ph: parseFloat(avgPh),
        });

        await rec.save();
        recommendations.push(rec);
        console.log(`✅ Recommandation générée pour ${product.name}`);

      } catch (error) {
        console.error(`Erreur lors de la génération de recommandation pour ${product.name}:`, error);
        // Continuer avec les autres produits même en cas d'erreur
        continue;
      }
    }

    console.log("recommendations finales :",recommendations)
    return res.status(201).json(recommendations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur lors de la génération' });
  }
};



exports.getRecommendationsByUser = async (req, res) => {
  try {
    const user = req.params.user

    const farms = await Farm.find({ owner: user });

    if (!farms.length) {
      return res.json([]);
    }

    const farmIds = farms.map(farm => farm._id);


    const recommendations = await Recommendation.find({ farm: { $in: farmIds } })

    return res.json(recommendations);

  } catch (error) {
    console.error("❌ Erreur récupération recommandations :", error);
    return res.status(500).json({ message: "Server error" });
  }
};



