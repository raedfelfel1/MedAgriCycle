import React, { useState } from "react";
import "../contexts/styles/Inscription.css";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";

const Inscription = () => {
  
  const [etape, setEtape] = useState(1);
  const [donnees, setDonnees] = useState({
  firstName: "",
  lastName: "",
  age: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  confirmation: "",
  location: ''
});

  const [message, setMessage] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const adresseRegex = /^[a-zA-Z0-9\s,'-]{5,100}$/;

  // Gestion des inputs
  const handleChange = (e) => {
    setDonnees({ ...donnees, [e.target.name]: e.target.value });
  };

  // Validation
  const validerEtape = () => {
    const erreursActuelles = {};

    if (etape === 1) {
      if (!donnees.lastName.trim()) erreursActuelles.lastName = "Le nom est requis.";
      if (!donnees.firstName.trim()) erreursActuelles.firstName = "Le prénom est requis.";
      if (!donnees.age.trim() || isNaN(donnees.age) || Number(donnees.age) < 15)
        erreursActuelles.age = "Âge invalide (minimum 15 ans).";
    }

    if (etape === 2) {
      if (!donnees.email || !emailRegex.test(donnees.email))
        erreursActuelles.email = "Adresse email invalide.";
      if (!donnees.phone || !phoneRegex.test(donnees.phone))
        erreursActuelles.phone = "Numéro invalide (8 à 15 chiffres).";
      if (donnees.address && !adresseRegex.test(donnees.address))
        erreursActuelles.address = "Adresse invalide (5 à 100 caractères).";
    }

    if (etape === 3) {
      if (!donnees.password)
        erreursActuelles.password= "Le mot de passe est requis.";
      else if (!passwordRegex.test(donnees.password))
        erreursActuelles.password =
          "Au moins 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.";
      if (!donnees.confirmation)
        erreursActuelles.confirmation = "Confirmez le mot de passe.";
      else if (donnees.password !== donnees.confirmation)
        erreursActuelles.confirmation = "Les mots de passe ne correspondent pas.";
    }

    setErreurs(erreursActuelles);
    return Object.keys(erreursActuelles).length === 0;
  };

  const suivant = () => {
    if (validerEtape()) setEtape((e) => e + 1);
  };

  const precedent = () => setEtape((e) => e - 1);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const toSend = { ...donnees };
      delete toSend.confirmation;
      const user = await createUser(toSend);
      //console.log(toSend);
      //const user = await createUser(donnees);
      setMessage("Inscription réussie !");
      setDonnees({
  firstName: "",
  lastName: "",
  age: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  confirmation: "",
  location: ''
});
        
      if (validerEtape()) {
      //console.log("Données :", donnees);
      navigate("/");}

    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription.");
    }
  };

console.log(donnees);

  return (
    <div className="formulaire-conteneur">
      <form className="formulaire" onSubmit={handleSubmit}>
        <h2 className="titre-formulaire">Formulaire d'inscription</h2>

        <div className="etapes">
          <span className={etape >= 1 ? "etape active" : "etape"}>1</span>
          <span className={etape >= 2 ? "etape active" : "etape"}>2</span>
          <span className={etape >= 3 ? "etape active" : "etape"}>3</span>
        </div>

        {etape === 1 && (
          <>
            <label>
              Nom :
              <input type="text" name="lastName" value={donnees.lastName} onChange={handleChange} />
              {erreurs.lastName && <p className="message-erreur">{erreurs.lastName}</p>}
            </label>
            <label>
              Prénom :
              <input type="text" name="firstName" value={donnees.firstName} onChange={handleChange} />
              {erreurs.firstName && <p className="message-erreur">{erreurs.firstName}</p>}
            </label>
            <label>
              Âge :
              <input type="number" name="age" value={donnees.age} onChange={handleChange} />
              {erreurs.age && <p className="message-erreur">{erreurs.age}</p>}
            </label>
          </>
        )}

        {etape === 2 && (
          <>
            <label>
              Email :
              <input type="email" name="email" value={donnees.email} onChange={handleChange} />
              {erreurs.email && <p className="message-erreur">{erreurs.email}</p>}
            </label>
            <label>
              Numéro de téléphone :
              <input type="text" name="phone" value={donnees.phone} onChange={handleChange} />
              {erreurs.phone && <p className="message-erreur">{erreurs.phone}</p>}
            </label>
            <label>
              Adresse (facultatif) :
              <input type="text" name="address" value={donnees.address} onChange={handleChange} />
              {erreurs.address && <p className="message-erreur">{erreurs.address}</p>}
            </label>
          </>
        )}

        {etape === 3 && (
          <>
            <label>
              Mot de passe :
              <input
                type="password"
                name="password"
                value={donnees.password}
                onChange={handleChange}
              />
              {erreurs.password && <p className="message-erreur">{erreurs.password}</p>}
            </label>
            <label>
              Confirmation :
              <input
                type="password"
                name="confirmation"
                value={donnees.confirmation}
                onChange={handleChange}
              />
              {erreurs.confirmation && <p className="message-erreur">{erreurs.confirmation}</p>}
            </label>
          </>
        )}

        <div className="boutons">
          {etape > 1 && (
            <button type="button" onClick={precedent}>
              Précédent
            </button>
          )}
          {etape < 3 && (
            <button type="button" onClick={suivant}>
              Suivant
            </button>
          )}
          {etape === 3 && <button type="submit">Valider</button>}
        </div>
      </form>
    </div>
  );
};

export default Inscription;
