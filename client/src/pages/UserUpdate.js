import React, { useState } from 'react';
import '../contexts/styles/UserUpdate.css';
import { useTheme } from '../contexts/ThemeContext';
import {
  Person,
  CalendarToday,
  Numbers,
  Email,
  Phone,
  LocationOn,
  Save,
  ArrowBack
} from '@mui/icons-material';
import BarSide from '../components/ui/BarSide';
import {
  WbSunnyOutlined,
  NightlightOutlined,
} from '@mui/icons-material';

const UserUpdate = ({ user = {}, onCancel, onSave }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    firstName: user.firstName || 'Stéphane',
    lastName: user.lastName || 'ZOUMBA',
    age: user.age || '28',
    adress: user.adress || 'Paris',
    userId: user.userId || 'USR-2024-001',
    email: user.email || 'stephane.zoumba@example.com',
    phone: user.phone || '+1 (555) 123-4567',
    location: user.location || ''
  });

  //Utilisation d'expressions régulières pour le contrôle des champs
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/; // lettres + espaces + tirets
  const ageRegex = /^(?:1[0-4][0-9]|150|[1-9]?[0-9])$/;
  // Accepte 0–150, rejette les négatifs, les >150, les lettres
  const addressRegex = /^[0-9]*[\p{L}0-9\s,'\.\-]{3,}$/u;


  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    adress: '',
    phone: '',
    age: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setErrors(prev => ({
        ...prev,
        email: emailRegex.test(value) ? '' : 'Adresse email invalide'
      }));
    }
    if (name === 'age') {
      if (!ageRegex.test(value)) {
        setErrors(prev => ({ ...prev, age: "Âge invalide (0 à 150)" }));
      } else {
        setErrors(prev => ({ ...prev, age: "" }));
      }
    }



    if (name === 'phone') {
      setErrors(prev => ({
        ...prev,
        phone: phoneRegex.test(value) ? '' : 'Numéro invalide'
      }));
    }

    if (name === 'firstName') {
      setErrors(prev => ({
        ...prev,
        firstName: nameRegex.test(value) ? '' : 'Le prénom ne doit contenir que des lettres'
      }));
    }

    if (name === 'adress') {
      setErrors(prev => ({
        ...prev,
        adress: addressRegex.test(value) ? '' : 'Adresse invalide'
      }));
    }

    if (name === 'lastName') {
      setErrors(prev => ({
        ...prev,
        lastName: nameRegex.test(value) ? '' : 'Le nom ne doit contenir que des lettres'
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const validations = {
      firstName: nameRegex.test(formData.firstName),
      lastName: nameRegex.test(formData.lastName),
      email: emailRegex.test(formData.email),
      phone: phoneRegex.test(formData.phone),
      age: ageRegex.test(formData.age),
      adress: addressRegex.test(formData.adress)
    };

    const hasErrors = Object.values(validations).includes(false);

    if (hasErrors) {
      setErrors({
        firstName: validations.firstName ? '' : 'Le prénom ne doit contenir que des lettres',
        lastName: validations.lastName ? '' : 'Le nom ne doit contenir que des lettres',
        email: validations.email ? '' : 'Adresse email invalide',
        phone: validations.phone ? '' : 'Numéro invalide',
        age: validations.age ? '' : 'Âge invalide (0 à 150)',
        adress: validations.adress ? '' : 'Adresse invalide'
      });
      return;
    }

    if (onSave) onSave(formData);
  };

  return (
    <>
      <BarSide />

      <form className={`user-update-form ${darkMode ? 'dark' : ''}`} onSubmit={handleSubmit}>
        <h2>Modifier les informations</h2>

        <div className="update-grid">
          <div className="update-item">
            <label><Person className="icon" /> Prénom</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="update-item">
            <label>Nom</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="update-item">
            <label><CalendarToday className="icon" /> Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required min="0"
              max="150" />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          <div className="update-item">
            <label><Numbers className="icon" /> ID</label>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} readOnly />
          </div>

          <div className="update-item">
            <label><Email className="icon" /> Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="update-item">
            <label><Phone className="icon" /> Numéro de téléphone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="update-item full-width">
            <label><LocationOn className="icon" /> Addresse</label>
            <input type="text" name="adress" value={formData.adress} onChange={handleChange} />
            {errors.adress && <span className="error-text">{errors.adress}</span>}
          </div>

          <div className="update-item full-width">
            <label><LocationOn className="icon" /> Localisation</label>
            <div className="location-options">
              <button
                type="button"
                className="location-btn"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                      setFormData(prev => ({ ...prev, location: coords }));
                    },
                    (error) => {
                      alert("Impossible d'accéder à la localisation : " + error.message);
                    }
                  );
                }}
              >
                Utiliser ma position actuelle
              </button>

              <button
                type="button"
                className="location-btn secondary"
                onClick={() => alert("Ouverture d'une carte (à intégrer avec Leaflet/Mapbox)")}
              >
                Choisir sur la carte
              </button>
            </div>
            {formData.location && (
              <p className="location-display">📍 {formData.location}</p>
            )}
          </div>

        </div>

        <div className="update-actions">
          <button className="dark-toggle" onClick={toggleDarkMode}>
            {darkMode ? <WbSunnyOutlined /> : <NightlightOutlined />}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            <ArrowBack fontSize="small" />
            Annuler
          </button>
          <button type="submit" className="save-btn">
            <Save fontSize="small" />
            Sauvegarder
          </button>
        </div>
      </form>

    </>
  );
};

export default UserUpdate;
