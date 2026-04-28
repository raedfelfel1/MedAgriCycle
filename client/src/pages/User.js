import React, { useState, useEffect } from 'react';
import '../contexts/styles/User.css';
import BarSide from '../components/ui/BarSide';
import { useTheme } from "../contexts/ThemeContext";
import {
  Edit,
  Delete,
  Brightness4,
  Brightness7,
  Person,
  CalendarToday,
  Numbers,
  Email,
  Phone,
  LocationOn,
  CheckCircle
} from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { fetchUserById, updateUser } from '../services/api';
const AlertComponent = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const User = () => {
  const { darkMode } = useTheme();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  //const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    age: '',
    address: '',
    id: '',
    email: '',
    phone: '',
    location: '',
    createdAt: ''
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const loadData = async () => {
    const user_Id = localStorage.getItem('userId');
    if (!user_Id) {
      setError("Aucun ID utilisateur trouvé");
      return;
    }

    try {
      const userData = await fetchUserById(user_Id);

      // Mettre à jour formData avec les infos de l'utilisateur
      setFormData({
        id: localStorage.getItem('userId') || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        age: userData.age?.toString() || '',
        address: userData.address || '',
        id: userData._id || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        createdAt: userData.createdAt || "2023-07-30T12:00:00Z"
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement de l'utilisateur");
    }
  };

  useEffect(() => {
    loadData();
  }, []);





  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    age: ''
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/;
  const ageRegex = /^(?:1[5-9]|[2-9][0-9]|1[0-4][0-9]|150)$/;
  const addressRegex = /^[0-9]*[\p{L}0-9\s,'\.\-]*$/u;



  /*const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };*/

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    // Envoi au serveur
    const response = await fetch("http://localhost:5000/api/images/upload-profile-image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    // data.url est l’URL de l’image stockée
    setProfileImage(data.url);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: emailRegex.test(value) ? '' : 'Adresse email invalide' }));
    } else if (name === 'age') {
      setErrors(prev => ({ ...prev, age: ageRegex.test(value) ? '' : 'Âge invalide (15 à 150)' }));
    } else if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: phoneRegex.test(value) ? '' : 'Numéro invalide' }));
    } else if (name === 'firstName') {
      setErrors(prev => ({ ...prev, firstName: nameRegex.test(value) ? '' : 'Le prénom ne doit contenir que des lettres' }));
    } else if (name === 'lastName') {
      setErrors(prev => ({ ...prev, lastName: nameRegex.test(value) ? '' : 'Le nom ne doit contenir que des lettres' }));
    } else if (name === 'address') {
      setErrors(prev => ({ ...prev, address: addressRegex.test(value) ? '' : 'Adresse invalide' }));
    }
  };

  const handleEditClick = () => setIsEditable(true);



  const handleConfirmClick = async () => {
    const validations = {
      firstName: nameRegex.test(formData.firstName),
      lastName: nameRegex.test(formData.lastName),
      email: emailRegex.test(formData.email),
      phone: phoneRegex.test(formData.phone),
      age: ageRegex.test(formData.age),
      address: addressRegex.test(formData.address)
    };

    const hasErrors = Object.values(validations).includes(false);

    if (hasErrors) {
      setErrors({
        firstName: validations.firstName ? '' : 'Le prénom ne doit contenir que des lettres',
        lastName: validations.lastName ? '' : 'Le nom ne doit contenir que des lettres',
        email: validations.email ? '' : 'Adresse email invalide',
        phone: validations.phone ? '' : 'Numéro invalide',
        age: validations.age ? '' : 'Âge invalide (15 à 150)',
        address: validations.address ? '' : 'Adresse invalide'
      });
      return;
    }

    try {
      const user_Id = localStorage.getItem('userId');
      //const userId="688c8e69740a34910a1029fa";
      const updated = await updateUser(user_Id, formData);
      setIsEditable(false);
      setSnackbar({
        open: true,
        message: 'Modifications enregistrées avec succès.',
        severity: 'success'
      });

      // Optionnel : mettre à jour localement le formData avec les données confirmées du backend
      setFormData(updated);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erreur lors de la mise à jour.',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = () => {
    setSnackbar({ open: true, message: 'Compte supprimé avec succès.', severity: 'info' });
  };

  return (
    <>
      <BarSide />
      <div className={`user-container ${darkMode ? 'dark' : ''}`}>
        <div className="user-header">
          <label className="user-avatar" htmlFor="profile-upload">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="avatar-image" />
            ) : (
              ''
            )}
          </label>
          <input type="file" id="profile-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

          <div className="user-info">
            <h2>{formData.lastName} {formData.firstName}</h2>
            <p>Membre depuis le {new Date(formData.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} </p>
          </div>

          <div className="user-status">
            {!isEditable ? (
              <button className="edit-button" onClick={handleEditClick}>
                <Edit fontSize="small" /> Modifier
              </button>
            ) : (
              <button className="edit-button confirm" onClick={handleConfirmClick}>
                <CheckCircle fontSize="small" /> Confirmer
              </button>
            )}
            <button className="edit-button delete" onClick={handleDeleteClick}>
              <Delete fontSize="small" /> Supprimer
            </button>
          </div>
        </div>

        <div className="user-section">
          <h3><Person className="section-icon" /> Informations basiques</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Prénom</label>
              <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} readOnly={!isEditable} />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="info-item">
              <label>Nom</label>
              <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} readOnly={!isEditable} />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
            <div className="info-item">
              <label><CalendarToday className="icon-inline" /> Age</label>
              <input name="age" type="number" min="15" max="150" value={formData.age} onChange={handleInputChange} readOnly={!isEditable} />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
            <div className="info-item">
              <label>Adresse</label>
              <input name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Not specified" readOnly={!isEditable} />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            <div className="info-item">
              <label><Numbers className="icon-inline" /> Identifiant</label>
              <input name="id" type="text" value={formData.id} readOnly />
            </div>
          </div>
        </div>

        <div className="user-section">
          <h3><Email className="section-icon" /> Informations de contact</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Adresse Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} readOnly={!isEditable} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="info-item">
              <label><Phone className="icon-inline" /> Numéro de téléphone</label>
              <input name="phone" type="text" value={formData.phone} onChange={handleInputChange} readOnly={!isEditable} />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
            <div className="info-item">
              <label><LocationOn className="icon-inline" /> Localisation</label>
              <input name="location" type="text" value={formData.location} onChange={handleInputChange} readOnly={!isEditable} placeholder="Not specified" />
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <AlertComponent onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </AlertComponent>
      </Snackbar>
    </>
  );
};

export default User;
