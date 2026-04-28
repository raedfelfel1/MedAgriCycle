import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { fetchRecommendations } from "../../services/api";
import "../../contexts/styles/TopRightSection.css";
// ✅ Import Material UI Icon
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Socket
// const socket = io("");

// Fonction de résumé simple
const summarizeRec = (rec) => {
  const {
    productName,
    temperature,
    humidity,
    ph,
    minTemp,
    maxTemp,
    minHumidity,
    maxHumidity,
    minPh,
    maxPh,
  } = rec;

  let issues = [];

  if (minTemp != null && maxTemp != null) {
    if (temperature < minTemp) issues.push("température trop basse");
    else if (temperature > maxTemp) issues.push("température trop élevée");
  }

  if (minHumidity != null && maxHumidity != null) {
    if (humidity < minHumidity) issues.push("humidité insuffisante");
    else if (humidity > maxHumidity) issues.push("humidité trop élevée");
  }

  if (minPh != null && maxPh != null) {
    if (ph < minPh) issues.push("sol trop acide");
    else if (ph > maxPh) issues.push("sol trop alcalin");
  }

  if (issues.length === 0) {
    return (
      <span className="optimal">
        {productName} : conditions normales{" "}
        <CheckCircleIcon sx={{ color: "#4CAF50", verticalAlign: "middle" }} />
      </span>
    );
  }

  return `${productName} : ${issues.join(", ")}`;
};

const TopRightSection = () => {
  const [farmId, setFarmId] = useState(localStorage.getItem("farmId") || null);
  const [recs, setRecs] = useState([]);
  const navigate = useNavigate();

  // ✅ On écoute notre event personnalisé
  useEffect(() => {
    const handleFarmChange = () => {
      setFarmId(localStorage.getItem("farmId"));
    };

    window.addEventListener("farmIdChanged", handleFarmChange);
    return () => window.removeEventListener("farmIdChanged", handleFarmChange);
  }, []);

  // Charger recommandations initiales
  const loadRecommendations = async (farmId) => {
    try {
      const data = await fetchRecommendations(farmId);
      setRecs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement recommandations", err);
    }
  };

  // 🔄 Recharge quand farmId change
  // useEffect(() => {
  //   if (!farmId) return;

  //   loadRecommendations(farmId);

  //   socket.emit("setFarmId", farmId);
  //   const handleNewRecommendation = (rec) => {
  //     setRecs((prev) => [rec, ...prev]);
  //   };

  //   socket.on("newRecommendation", handleNewRecommendation);
  //   return () => {
  //     socket.off("newRecommendation", handleNewRecommendation);
  //   };
  // }, [farmId]);

  const summaryList = recs.map(summarizeRec);

  const handleVoirDetail = () => navigate("/recommandation");

  return (
    <div className="topRight">
      <div className="resume-recommandations">
        <h3>Recommandations</h3>
        {summaryList.length === 0 ? (
          <p>Aucune recommandation disponible</p>
        ) : (
          <ul>
            {summaryList.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}
        <button className="btn-detail" onClick={handleVoirDetail}>
          Voir recommandations complètes
        </button>
      </div>
    </div>
  );
};

export default TopRightSection;
