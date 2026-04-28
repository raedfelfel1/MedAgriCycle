import React, { useState } from 'react';
import {
  TextField, Button, Paper, Typography, Grid,
  InputAdornment, Snackbar
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
import '../contexts/styles/AddFarm.css';
import { useData } from '../contexts/DataContext';
import BarSide from '../components/ui/BarSide';

const AddFarm = () => {
  const { createFarm } = useData();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    temperature: '',
    humidity: '',
    ph: '',
    area: '',
    owner:''
    
  });

  const [step, setStep] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const farmToSend = {
    name: formData.name,
    location:formData.location,
    createdAt: new Date(formData.date),
    /*temperatureSensor: formData.temperature ? parseFloat(formData.temperature) : null,
    humiditySensor: formData.humidity ? parseFloat(formData.humidity) : null,
    phSensor: formData.ph ? parseFloat(formData.ph) : null,*/
    area: formData.area ? parseFloat(formData.area) : null,
    owner:localStorage.getItem('userId') || null
  
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      temperature: '',
      humidity: '',
      ph: '',
      area: '',
      owner:''
      
      
    });
    setStep(1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleNext = () => {
    if (!formData.name || !formData.location) {
      setSnackbar({ open: true, message: 'Le nom et la localisation sont obligatoires', severity: 'error' });
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.ph && (formData.ph < 0 || formData.ph > 14)) {
        throw new Error('Le pH doit être entre 0 et 14');
      }
      if (formData.humidity && (formData.humidity < 0 || formData.humidity > 100)) {
        throw new Error("L'humidité doit être entre 0 et 100%");
      }

      await createFarm(farmToSend);
      setSnackbar({ open: true, message: 'Ferme créée avec succès!', severity: 'success' });
      resetForm();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Erreur lors de la création de la ferme', severity: 'error' });
    }
  };

  return (
    <>
    <BarSide/>
    <Paper elevation={3} className="farm-form-container">
      <Typography variant="h5" component="h2" className="form-title">
        <GrassIcon className="title-icon" /> Nouvelle Ferme
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {step === 1 && (
            <>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date de création"
                  name="date"
                  type="date"
                  value={formData.date}
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

              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" onClick={handleNext}>
                  Suivant
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Enregistrer
                </Button>
              </Grid>
            </>
          )}

          {step === 2 && (
            <>
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
                    startAdornment: <InputAdornment position="start"><ThermostatIcon /></InputAdornment>,
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
                    startAdornment: <InputAdornment position="start"><HumidityIcon /></InputAdornment>,
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
                    startAdornment: <InputAdornment position="start"><PhIcon /></InputAdornment>
                  }}
                />
              </Grid>

              {/* Superficie */}
              <Grid item xs={12} md={6}>
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
                    startAdornment: <InputAdornment position="start"><AreaIcon /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">ha</InputAdornment>
                  }}
                />
              </Grid>

              {/* Navigation */}
              <Grid item xs={12} md={6}>
                <Button fullWidth variant="contained" onClick={handleBack}>Retour</Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  Enregistrer
                </Button>
              </Grid>
            </>
          )}

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              elevation={6}
              variant="filled"
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Grid>
      </form>
    </Paper>

  </>
  );
};

export default AddFarm;

