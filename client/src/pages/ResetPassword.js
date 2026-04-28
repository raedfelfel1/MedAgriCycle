import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const env = require("../contexts/utils/env");
const API_URL = env.API_IP;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.");
      return;
    }

    if (password !== confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Mot de passe mis à jour avec succès !");
        navigate("/");
      } else {
        alert(data.message || "Lien invalide ou expiré.");
      }
    } catch (error) {
      alert("Erreur réseau !");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="title">Nouveau mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="show-button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Masquer" : "Afficher"}
            </span>
          </div>
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="input-field"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <button type="submit" className="login-button">
            Réinitialiser
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;