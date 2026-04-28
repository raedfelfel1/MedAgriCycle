import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  InputAdornment,
  Snackbar
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { Category, Opacity, Thermostat, Science, Grass } from '@mui/icons-material';
import '../contexts/styles/UpdateProduct.css';
import { updateProduct, getProductById } from '../services/api';

const UpdateProduct = ({ productId, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minTemperature: '',
    maxTemperature: '',
    minHumidite: '',
    maxHumidite: '',
    minPh: '',
    maxPh: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(productId);
        setFormData({
          name: product.name || '',
          category: product.category || '',
          minTemperature: product.minTemperature ?? '',
          maxTemperature: product.maxTemperature ?? '',
          minHumidite: product.minHumidite ?? '',
          maxHumidite: product.maxHumidite ?? '',
          minPh: product.minPh ?? '',
          maxPh: product.maxPh ?? ''
        });
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.minPh < 0 || formData.maxPh > 14) {
        throw new Error("Le pH doit être entre 0 et 14");
      }
      if (formData.minHumidite < 0 || formData.maxHumidite > 100) {
        throw new Error("L'humidité doit être entre 0 et 100%");
      }
      const updated = await updateProduct(productId, formData);
      setSnackbar({ open: true, message: "Produit mis à jour avec succès", severity: "success" });
      onProductUpdated(updated);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Erreur de mise à jour", severity: "error" });
    }
  };

  return (
    <Paper className="update-product-container">
      <Typography variant="h5" className="form-title">
        <Grass className="title-icon" />
        Modifier Produit
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Nom" name="name" value={formData.name} onChange={handleChange} fullWidth required
              InputProps={{ startAdornment: <InputAdornment position="start"><Grass /></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Catégorie" name="category" value={formData.category} onChange={handleChange} fullWidth required
              InputProps={{ startAdornment: <InputAdornment position="start"><Category /></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="Température min" name="minTemperature" value={formData.minTemperature} onChange={handleChange} fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><Thermostat /></InputAdornment>, endAdornment: <InputAdornment position="end">°C</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="Température max" name="maxTemperature" value={formData.maxTemperature} onChange={handleChange} fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">°C</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="Humidité min" name="minHumidite" value={formData.minHumidite} onChange={handleChange} fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><Opacity /></InputAdornment>, endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="Humidité max" name="maxHumidite" value={formData.maxHumidite} onChange={handleChange} fullWidth
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="pH min" name="minPh" value={formData.minPh} onChange={handleChange} fullWidth inputProps={{ step: 0.1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Science /></InputAdornment> }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField type="number" label="pH max" name="maxPh" value={formData.maxPh} onChange={handleChange} fullWidth inputProps={{ step: 0.1 }} />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth className="submit-button">Enregistrer</Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default UpdateProduct;
