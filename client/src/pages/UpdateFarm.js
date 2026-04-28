import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Grass as GrassIcon,
  LocationOn as LocationIcon,
  Thermostat as ThermostatIcon,
  Opacity as HumidityIcon,
  Science as PhIcon,
  Straighten as AreaIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';
import Alert from '@mui/material/Alert';
import '../contexts/styles/UpdateFarm.css';
import { updateFarm } from '../services/api';

const UpdateFarm = ({ farmData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({ ...farmData });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (farmData) {
      setFormData({ ...farmData });
    }
  }, [farmData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name || !formData.location) {
      throw new Error('Le nom et la localisation sont obligatoires.');
    }
    if (formData.ph && (formData.ph < 0 || formData.ph > 14)) {
      throw new Error('Le pH doit être entre 0 et 14.');
    }
    if (formData.humidity && (formData.humidity < 0 || formData.humidity > 100)) {
      throw new Error("L'humidité doit être entre 0 et 100%.");
    }
    if (formData.area && (formData.area < 0 || formData.area > 10)) {
      throw new Error("La superficie doit être entre 0 et 10 hectares.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validate();
      const updated = await updateFarm(formData._id, formData);
      setSnackbar({
        open: true,
        message: 'Ferme mise à jour avec succès ✅',
        severity: 'success'
      });
      onUpdateSuccess(updated); // 🔁 callback vers le parent
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erreur lors de la mise à jour ❌',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} className="update-farm-container">
      <Typography variant="h5" className="form-title">
        <GrassIcon className="title-icon" /> Modifier les Informations
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nom */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de la ferme"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GrassIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Localisation */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Localisation"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date de création"
              name="createdAt"
              type="date"
              value={formData.createdAt?.split('T')[0]}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Température */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Température (°C)"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ThermostatIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">°C</InputAdornment>
              }}
            />
          </Grid>

          {/* Humidité */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Humidité (%)"
              name="humidity"
              type="number"
              value={formData.humidity}
              onChange={(e) => {
                handleChange(e);
                let value = e.target.value;
                if (value !== '') {
                  value = Math.max(0, Math.min(100, Number(value)));
                }
                setFormData({ ...formData, humidity: value });
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HumidityIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
            />
          </Grid>

          {/* pH */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="pH du sol"
              name="ph"
              type="number"
              value={formData.ph}
              onChange={(e) => {
                handleChange(e);
                let value = e.target.value;
                if (value !== '') {
                  value = Math.max(0, Math.min(14, parseFloat(value)));
                  value = parseFloat(value.toFixed(1));
                }
                setFormData({ ...formData, ph: value });
              }}
              inputProps={{ min: 0, max: 14, step: 0.1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Superficie */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Superficie (ha)"
              name="area"
              type="number"
              value={formData.area}
              onChange={(e) => {
                handleChange(e);
                let value = e.target.value;
                if (value !== '') {
                  value = Math.max(0, Math.min(10, parseFloat(value)));
                  value = parseFloat(value.toFixed(1));
                }
                setFormData({ ...formData, area: value });
              }}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AreaIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">ha</InputAdornment>
              }}
            />
          </Grid>

          {/* Bouton */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
              Mettre à jour
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default UpdateFarm;
