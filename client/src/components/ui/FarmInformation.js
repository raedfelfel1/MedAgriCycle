import React, { useState, useEffect } from 'react';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Agriculture as FarmIcon,
  Straighten as AreaIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete
} from '@mui/icons-material';
import {
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Grid
} from '@mui/material';
import '../../contexts/styles/FarmInformation.css';
import { useTheme } from '../../contexts/ThemeContext';
import { deleteFarm } from '../../services/api';
import { useNavigate } from 'react-router-dom';


const FarmInformation = ({ farm, onSave }) => {
  const { darkMode } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...farm });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [errors, setErrors] = useState({});

  const AREA_MIN = 0;
  const AREA_MAX = 100;
  const navigate = useNavigate();

  const deleteUserFarm=async()=>{
    if(!farm) return
    try {
      await deleteFarm(farm._id)
      setSnackbar({ open: true, message: 'Suppressions effectués', severity: 'success' });

      navigate(0);


    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
      
    }
  }
  useEffect(() => {
    if (farm) {
      setFormData({ ...farm });
      validateArea(farm.area);
    }
  }, [farm]);


  const validateArea = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return "La superficie doit être un nombre";
    if (numValue < AREA_MIN) return `La superficie ne peut pas être inférieure à ${AREA_MIN} ha`;
    if (numValue > AREA_MAX) return `La superficie ne peut pas dépasser ${AREA_MAX} ha`;
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'area') {
      const error = validateArea(value);
      setErrors(prev => ({ ...prev, area: error }));
      if (!error || value === "") {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const areaError = validateArea(formData.area);
    if (areaError) {
      setErrors(prev => ({ ...prev, area: areaError }));
      setSnackbar({ open: true, message: 'Veuillez corriger les erreurs dans le formulaire', severity: 'error' });
      return;
    }
    if (!formData.name || !formData.location?.zone) {
      setSnackbar({ open: true, message: 'Nom et zone requis', severity: 'error' });
      return;
    }
    setEditMode(false);
    onSave?.(formData);
    setSnackbar({ open: true, message: 'Modifications enregistrées', severity: 'success' });
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (!farm) {
    return (
      <div className={`farm-info-container empty ${darkMode ? 'dark' : ''}`}>
        <div className="farm-top-bar">
        </div>
        <div className="empty-message">Sélectionnez une ferme</div>
      </div>
    );
  }

  return (
    <form className={`farm-info-container ${darkMode ? 'dark' : ''}`} onSubmit={handleSubmit}>
      <div className="farm-top-bar">
        <div className="farm-title-section">
          <FarmIcon className="farm-main-icon" />
          <div className="farm-name-id">
            <h2 className="farm-name">{formData.name}</h2>
            <span className="farm-id">#{formData.id}</span>
          </div>
        </div>
        <div className="farm-actions">
          <IconButton onClick={deleteUserFarm}><Delete/></IconButton>
          {!editMode ? (
            <IconButton onClick={() => setEditMode(true)}><EditIcon /></IconButton>
          ) : (
            <>
              <IconButton type="submit"><SaveIcon /></IconButton>
              <IconButton onClick={() => {
                setEditMode(false);
                setFormData({ ...farm });
                setErrors({});
              }}><CancelIcon /></IconButton>
            </>
          )}
        </div>
      </div>

      <Grid container spacing={2} className="farm-details-grid">
        <Grid item xs={12} md={6} className="detail-item">
          <LocationIcon className="detail-icon" />
          {editMode ? (
            <TextField
              label="Zone"
              name="location.zone"
              fullWidth
              value={formData.location?.zone || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, zone: e.target.value }
              }))}
            />
          ) : (
            <span>{formData.location?.zone} — lat: {formData.location?.latitude}, long: {formData.location?.longitude}</span>
          )}
        </Grid>

        <Grid item xs={12} md={6} className="detail-item">
          <AreaIcon className="detail-icon" />
          {editMode ? (
            <TextField
              label="Superficie (ha)"
              name="area"
              type="number"
              value={formData.area || ''}
              onChange={handleChange}
              error={!!errors.area}
              inputProps={{ min: AREA_MIN, max: AREA_MAX, step: "0.01" }}
              fullWidth
            />
          ) : (
            <span><span className="detail-label">Superficie :</span> {formData.area} ha</span>
          )}
        </Grid>

        <Grid item xs={12} md={6} className="detail-item">
          <CalendarIcon className="detail-icon" />
          <span>{new Date(formData.createdAt).toLocaleDateString()}</span>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default FarmInformation;
