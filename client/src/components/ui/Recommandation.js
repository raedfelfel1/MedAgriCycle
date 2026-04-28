import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { fetchFarmById, fetchFarms, fetchFarmsByUser, fetchRecommendations, generateRecommendations } from "../../services/api";
import BarSide from "../../components/ui/BarSide";
import { useTheme } from "../../contexts/ThemeContext";

// MUI
import { Card, CardContent, Button, MenuItem, Select, Chip, Tooltip } from "@mui/material";

// Icons
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";

import "../../contexts/styles/RecommandationAncien.css";

const socket = io("");

/** Formate les segments **gras** dans une ligne (sans lib externe) */
const inlineFormat = (text) => {
  if (!text) return null;
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(<strong key={`b-${m.index}`}>{m[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

/**
 * Transforme un texte multiline en “rich text” :
 * - regroupe les lignes "1. ..." en <ol>
 * - regroupe les lignes "- ..." en <ul>
 * - gère le **gras** inline
 * - paragraphes aérés
 */
const renderRichText = (message) => {
  if (!message) return null;
  const rawLines = message
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const out = [];
  let i = 0;
  let groupKey = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // Liste numérotée
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol className="rt-ol" key={`ol-${groupKey++}`}>
          {items.map((t, idx) => (
            <li key={idx}>{inlineFormat(t)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Liste à puces
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < rawLines.length && /^-\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^-\s+/, ""));
        i++;
      }
      out.push(
        <ul className="rt-ul" key={`ul-${groupKey++}`}>
          {items.map((t, idx) => (
            <li key={idx}>{inlineFormat(t)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraphe
    out.push(
      <p className="rt-p" key={`p-${groupKey++}`}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return <div className="rich-text">{out}</div>;
};

const SkeletonCard = ({ dark }) => (
  <Card className={`reco-card ${dark ? "dark-surface" : ""}`}>
    <CardContent>
      <div className="skeleton sk-title" />
      <div className="skeleton sk-line" />
      <div className="skeleton sk-line" />
      <div className="sk-meta">
        <span className="skeleton sk-chip" />
        <span className="skeleton sk-chip" />
        <span className="skeleton sk-chip" />
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ dark }) => (
  <div className={`empty-state ${dark ? "dark-surface" : ""}`}>
    <div className="empty-badge">🤖</div>
    <h3>Aucune recommandation disponible</h3>
    <p>Génère une recommandation pour voir les conseils formatés proprement.</p>
  </div>
);

const Recommandation = () => {
  const [recommandations, setRecommandations] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  // const [darkMode, setDarkMode] = useState(false);
  const firstRun = useRef(true);
  const [filterName, setFilterName] = useState("");

  const userId = localStorage.getItem("userId");
  // Charger les fermes
  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await fetchFarmsByUser(userId);
        setFarms(data);
        if (data.length > 0) {
          setSelectedFarm(data[0]._id);
        }
      } catch {
        console.error("Impossible de charger les fermes");
      }
    };
    loadFarms();
  }, []);

  // Charger recommandations
  const loadRecommendations = async (userId) => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await fetchRecommendations(userId);
      setRecommandations(Array.isArray(data) ? data : []);
    } catch {
      console.error("Impossible de charger les recommandations");
    } finally {
      setLoading(false);
    }
  };

  // Générer
  const handleGenerate = async () => {
    if (!selectedFarm) return;
    try {
      setLoading(true);
      await generateRecommendations(selectedFarm);
      await loadRecommendations(userId);
    } catch {
      console.error("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  // Socket temps réel
  useEffect(() => {
    if (!selectedFarm) return;

    if (!firstRun.current) {
      // rafraîchir dès qu’on change de ferme
      handleGenerate();
    } else {
      firstRun.current = false;
    }

    // socket.emit("setFarmId", selectedFarm);

    const handleNewRecommendation = (rec) => {
      setRecommandations((prev) => [rec, ...prev]);
    };

    socket.on("newRecommendation", handleNewRecommendation);
    return () => {
      socket.off("newRecommendation", handleNewRecommendation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm]);

  // Recharger à chaque changement de ferme
  /*useEffect(() => {
    if (selectedFarm) loadRecommendations(selectedFarm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFarm]);*/

  useEffect(() => {
    if (selectedFarm) {
      setFilterName(""); // reset le filtre quand on change de ferme
      loadRecommendations(selectedFarm);
    }
  }, [selectedFarm]);
  console.log(recommandations)
  return (
    <div className={`reco-page ${darkMode ? "dark" : ""}`}>

      <main className="reco-main">
        {/* Header */}
        <div className="reco-header">
          <div>
            <h2 className="reco-title">📌 Recommandations</h2>
            <p className="reco-subtitle">
              Conseils agronomiques contextualisés selon <strong>température</strong>, <strong>humidité</strong> et <strong>pH</strong>.
            </p>
          </div>

          <input
            type="text"
            placeholder="Filtrer par nom de culture..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="filter-input" />


          <div className="reco-actions">
            <Select
              value={selectedFarm || ""}
              onChange={(e) => setSelectedFarm(e.target.value)}
              size="small"
              className="farm-select"
              displayEmpty
            >
              {farms.map((farm) => (
                <MenuItem key={farm._id} value={farm._id}>
                  {farm.name}
                </MenuItem>
              ))}
            </Select>

            <Tooltip title="Générer une nouvelle recommandation">
              <span>
                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={loading || !selectedFarm}
                  className="btn-generate"
                >
                  Générer
                </Button>
              </span>
            </Tooltip>

            <Button variant="outlined" onClick={toggleDarkMode} className="btn-theme">
              {darkMode ? <WbSunnyIcon /> : <DarkModeIcon />}
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="reco-grid">
          {loading && recommandations.length === 0 && (
            <>
              <SkeletonCard dark={darkMode} />
              <SkeletonCard dark={darkMode} />
              <SkeletonCard dark={darkMode} />
            </>
          )}

          {!loading && recommandations.length === 0 && <EmptyState dark={darkMode} />}

          {recommandations
            .filter((rec) =>
              rec.productName?.toLowerCase().includes(filterName.toLowerCase())
            )
            .map((rec, index) => (
              <Card key={index} className={`reco-card ${darkMode ? "dark-surface" : ""}`}>
                <CardContent>
                  {/* Header du card */}
                  <div className="card-head">
                    <div className="card-title">
                      <AgricultureIcon className="title-icon" />
                      <h3>{rec.productName || "Culture inconnue"}</h3>
                    </div>
                    <div className="card-chips">
                      <Chip
                        size="small"
                        icon={<ThermostatIcon />}
                        label={`${rec.temperature ?? "–"}°C`}
                        className="chip temp"
                      />
                      <Chip
                        size="small"
                        icon={<WaterDropIcon />}
                        label={`${rec.humidity ?? "–"}%`}
                        className="chip hum"
                      />
                      <Chip
                        size="small"
                        icon={<ScienceIcon />}
                        label={`pH ${rec.ph ?? "–"}`}
                        className="chip ph"
                      />
                    </div>
                  </div>

                  {/* Corps du message formaté */}
                  <div className="card-body">{renderRichText(rec.message)}</div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Recommandation;


