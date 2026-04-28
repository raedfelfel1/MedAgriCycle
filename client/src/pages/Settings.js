import React, { useEffect, useState } from "react";
import BarSide from "../components/ui/BarSide";
import "../contexts/styles/Settings.css";
import { useTheme } from "../contexts/ThemeContext";

const TEMPERATURE_UNITS = {
  celsius: "Celsius (°C)",
  fahrenheit: "Fahrenheit (°F)",
  kelvin: "Kelvin (K)"
};

const LANGUAGES = {
  fr: "Français",
  en: "English"
};

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [unit, setUnit] = useState(localStorage.getItem("tempUnit") || "celsius");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "fr");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("tempUnit", unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", notificationsEnabled);
  }, [notificationsEnabled]);

  return (
    <div className="settings-pro-page">
      <BarSide />
      <main className="settings-pro-main">
        <h1 className="settings-title">Paramètres de l'application</h1>

        <div className="settings-grid">
          {/* Dark Mode */}
          <div className="setting-card">
            <div className="setting-card-header">
              <h2>Mode sombre</h2>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <span className="slider"></span>
              </label>
            </div>
            <p>
              Activez ou désactivez le mode sombre pour réduire la fatigue oculaire
              et économiser l'énergie.
            </p>
          </div>

          {/* Unité de température */}
          <div className="setting-card">
            <h2>Unité de température</h2>
            <select
              className="select-unit"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              aria-label="Choisir unité de température"
            >
              {Object.entries(TEMPERATURE_UNITS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p>
              Choisissez l'unité dans laquelle les températures seront affichées.
              Par défaut, les données sont en Celsius.
            </p>
          </div>

          {/* Langue */}
          <div className="setting-card">
            <h2>Langue</h2>
            <select
              className="select-lang"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              aria-label="Choisir langue"
            >
              {Object.entries(LANGUAGES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p>
              Sélectionnez la langue de l'interface utilisateur.
            </p>
          </div>

          {/* Notifications */}
          <div className="setting-card">
            <div className="setting-card-header">
              <h2>Notifications</h2>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <p>
              Activez les notifications pour recevoir des alertes importantes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
