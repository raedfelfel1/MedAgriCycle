import React, { useEffect, useState } from "react";
import "../contexts/styles/Connexion.css";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase"; 
import { FaGoogle } from "react-icons/fa";
const env = require("../contexts/utils/env")
const API_URL = env.API_IP;
const Connexion = ({children}) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login: authLogin,isAuthenticated } = useAuth();
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSent(true);
    } catch (error) {
      alert("Erreur réseau !");
    }
  };
  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });

      const data = await response.json();

      if (response.ok) {
        authLogin(data.token, data.user);
        navigate("/farm");
      } else {
        alert(data.message || "Échec de la connexion Google.");
      }
    } catch (error) {
      console.error("Erreur Google :", error);
      alert("Échec de la connexion Google.");
    }
  };
  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/mfa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code: mfaCode }),
      });

      const data = await response.json();

      if (response.ok) {
        authLogin(data.token, data.user);
        navigate("/farm");
      } else {
        alert(data.message || "Code incorrect.");
      }
    } catch (error) {
      alert("Erreur réseau !");
    }
  };
  const validate = () => {
    const newErrors = {};

    // Expression régulière pour email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Expression régulière pour téléphone (10 à 15 chiffres)
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    // Mot de passe : min 8 caractères, une majuscule, un chiffre, un caractère spécial
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Validation login
    if (!login) {
      newErrors.login = "Veuillez entrer votre adresse Email ou numéro de téléphone.";
    } else if (!emailRegex.test(login) && !phoneRegex.test(login)) {
      newErrors.login = " Email Invalide ou mauvais format de numéro.";
    }

    // Validation mot de passe
    if (!password) {
      newErrors.password = "Veuillez entrer votre mot de passe";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères dont au moins une lettre majuscule,un chiffre,un caractère spécial.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();

  if(isAuthenticated()){
    navigate("/board", { replace: true })
  }
  const goToInscription = () => {
    navigate('/inscription');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        authLogin(data.token, data.user);
        navigate("/farm");
      }
        //setPendingEmail(data.user.email || login);
        //setMfaStep(true);
       else {
        alert(data.message || "Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau !");
    }
  };

  if (mfaStep) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="icon-wrapper">
            <FaLock className="lock-icon" />
          </div>
          <h2 className="title">Vérification</h2>
          <p style={{ textAlign: "center", marginBottom: 16 }}>
            Un code a été envoyé à <strong>{pendingEmail}</strong>
          </p>
          <form onSubmit={handleVerifyMfa}>
            <input
              type="text"
              placeholder="Code à 6 chiffres"
              className="input-field"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              maxLength={6}
            />
            <button type="submit" className="login-button">
              Vérifier
            </button>
            <button type="button" className="create-account-button" onClick={() => setMfaStep(false)}>
              Retour
            </button>
          </form>
        </div>
      </div>
    );
  }
  if (forgotStep) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="icon-wrapper">
            <FaLock className="lock-icon" />
          </div>
          {forgotSent ? (
            <>
              <h2 className="title">Email envoyé</h2>
              <p style={{ textAlign: "center" }}>
                Si cet email existe, un lien de réinitialisation a été envoyé.
              </p>
              <button className="login-button" onClick={() => { setForgotStep(false); setForgotSent(false); }}>
                Retour
              </button>
            </>
          ) : (
            <>
              <h2 className="title">Mot de passe oublié</h2>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="input-field"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button type="submit" className="login-button">
                  Envoyer le lien
                </button>
                <button type="button" className="create-account-button" onClick={() => setForgotStep(false)}>
                  Retour
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="icon-wrapper">
          <FaLock className="lock-icon" />
        </div>
        <h2 className="title">Se connecter</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Phone number"
            className="input-field"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          {errors.login && <p className="error-text">{errors.login}</p>}

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="show-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}

          <div className="options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="custom-checkbox" />
              Me rappeler
            </label>
            <a href="#" className="forgot-password" onClick={(e) => { e.preventDefault(); setForgotStep(true); }}>
              Mot de passe oublié?
            </a>
          </div>

          <button type="submit" className="login-button">
            Se connecter
          </button>
          <button type="button" className="google-button" onClick={handleGoogle}>
            <FaGoogle style={{ marginRight: 8 }} />
            Continuer avec Google
          </button>
          <button type="button" className="create-account-button" onClick={goToInscription}>
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
