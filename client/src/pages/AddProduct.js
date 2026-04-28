import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Grid, 
  InputAdornment,
  MenuItem,
  Divider,
   Snackbar
} from '@mui/material';
import {
  Category as CategoryIcon,
  Thermostat as TemperatureIcon,
  Opacity as HumidityIcon,
  Science as PhIcon,
  Grass as FarmIcon,
  Add as AddIcon
} from '@mui/icons-material';
import '../contexts/styles/AddProduct.css';
import {fetchTanksByFarm } from '../services/api';
import {Alert} from '@mui/material';
import { useData } from '../contexts/DataContext';
import BarSide from '../components/ui/BarSide';


const AddProduct = () => {

  const [fertilizerTanks,setFertilizerTanks]=useState([]);
  const [waterTanks,setWaterTanks]=useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minTemperature: '',
    maxTemperature: '',
    minHumidite: '',
    maxHumidite: '',
    minPh: '',
    maxPh: '',
    farm: localStorage.getItem("farmId"),
    fertilizerTank:null,
    waterTank:null,
  });
  useEffect(()=>{
    const farmId=localStorage.getItem("farmId");
    const loadTanks=async ()=>{
      if(farmId){
        try {
          const tanks = await fetchTanksByFarm(farmId)
            setWaterTanks(tanks.filter(tank => tank.type === "water"))
            setFertilizerTanks(tanks.filter(tank => tank.type === "fertilizer"))
        } catch (error) {
          console.error("Erreur lors du chargement des tanks",error.message)
        }
      }
    }
    loadTanks()
  },[])
  console.log(waterTanks)
  const { farms, createProduct } = useData();

  const categories = [
    'Légumes',
    'Fruits',
    'Céréales',
    'Légumineuses',
    'Plantes médicinales'
  ];

  

    // Préparation des données pour l'API
    const productToSend = {
      ...formData,
      minTemperature: parseFloat(formData.minTemperature) || null,
      maxTemperature: parseFloat(formData.maxTemperature) || null,
      minHumidite: parseFloat(formData.minHumidite) || null,
      maxHumidite: parseFloat(formData.maxHumidite) || null,
      minPh: parseFloat(formData.minPh) || null,
      maxPh: parseFloat(formData.maxPh) || null,
      fertilizerTank:formData.fertilizerTank||null,
      waterTank:formData.waterTank||null,
      farm:localStorage.getItem("farmId") //farms.find(f => f.name === formData.farm)?._id || formData.farm
    };

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //onSubmit(formData);

    // Vérification que l'ID de la ferme est valide



    // Affichez les données du formulaire dans la console
  console.log("Les données avant envoi du formulaire", productToSend);
   
    try {
      // Validation des données
      if (formData.minPh < 0 || formData.maxPh > 14) {
        throw new Error('Le pH doit être entre 0 et 14');
      }
      if (formData.minHumidite < 0 || formData.maxHumidite > 100) {
        throw new Error('L\'humidité doit être entre 0 et 100%');
      }

      await createProduct(productToSend);
    setSnackbar({
     open: true,
    message: 'Produit créé avec succès!',
    severity: 'success'
});


      resetForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'Erreur lors de la création du produit',
        severity: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      minTemperature: '',
      maxTemperature: '',
      minHumidite: '',
      maxHumidite: '',
      minPh: '',
      maxPh: '',
      farm: localStorage.getItem("farmId"),
      waterTank:null,
      fertilizerTank:null,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
    <BarSide/>
    <Paper elevation={3} className="product-form-container">
      <Typography variant="h5" component="h2" className="form-title">
        <AddIcon className="title-icon" /> Nouveau Produit Agricole
      </Typography>

      <form onSubmit={handleSubmit}>
        
        <Grid container spacing={3}>
          {/* Informations de base */}
          
          <Grid item xs={12} >
            <Divider textAlign="left" className="section-divider">
              <Typography color="textSecondary">Identification</Typography>
            </Divider>
          </Grid>
         
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom du produit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                ),
              }}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Conditions optimales */}
          <Grid item xs={12}>
            <Divider textAlign="left" className="section-divider">
              <Typography color="textSecondary">Conditions optimales</Typography>
            </Divider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Température minimale (°C)"
              name="minTemperature"
              type="number"
              value={formData.minTemperature}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TemperatureIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Température maximale (°C)"
              name="maxTemperature"
              type="number"
              value={formData.maxTemperature}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TemperatureIcon />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
              }}
            />
          </Grid>
{/*Le taux d'humidité est entre 0 et 100 */}
          {/* Champ Humidité minimale */}
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Humidité minimale (%)"
    name="minHumidite"
    type="number"
    value={formData.minHumidite}
    onChange={(e) => {
      handleChange(e);
      let value = e.target.value;
      if (value !== '') {
        value = Math.max(0, Math.min(100, Number(value)));
      }
      setFormData({...formData, minHumidite: value});
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <HumidityIcon />
        </InputAdornment>
      ),
      endAdornment: <InputAdornment position="end">%</InputAdornment>,
    }}
    inputProps={{
      min: 0,
      max: 100,
      step: 1
    }}
    error={formData.minHumidite < 0 || formData.minHumidite > 100}
    helperText={
      (formData.minHumidite < 0 || formData.minHumidite > 100) 
        ? "Doit être entre 0 et 100" 
        : ""
    }
  />
</Grid>

{/* Champ Humidité maximale */}
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="Humidité maximale (%)"
    name="maxHumidite"
    type="number"
    value={formData.maxHumidite}
    onChange={(e) => {
      handleChange(e);
      let value = e.target.value;
      if (value !== '') {
        value = Math.max(0, Math.min(100, Number(value)));
      }
      setFormData({...formData, maxHumidite: value});
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <HumidityIcon />
        </InputAdornment>
      ),
      endAdornment: <InputAdornment position="end">%</InputAdornment>,
    }}
    inputProps={{
      min: 0,
      max: 100,
      step: 1
    }}
    error={formData.maxHumidite < 0 || formData.maxHumidite > 100}
    helperText={
      (formData.maxHumidite < 0 || formData.maxHumidite > 100) 
        ? "Doit être entre 0 et 100" 
        : ""
    }
  />
</Grid>
{/*Le ph doit être compris entre 0 et 14*/ }
{/* Champ pH Minimum */}
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="pH minimum"
    name="minPh"
    type="number"
    value={formData.minPh}
    onChange={(e) => {
      handleChange(e);
      let value = e.target.value;
      if (value !== '') {
        value = Math.max(0, Math.min(14, parseFloat(value)));
        value = parseFloat(value.toFixed(1)); // Limite à 1 décimale
      }
      setFormData({...formData, minPh: value});
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <PhIcon color={
            formData.minPh < 0 || formData.minPh > 14 
              ? "error" 
              : "inherit"
          } />
        </InputAdornment>
      ),
    }}
    inputProps={{
      min: 0,
      max: 14,
      step: 0.1
    }}
    error={formData.minPh < 0 || formData.minPh > 14}
    helperText={
      (formData.minPh < 0 || formData.minPh > 14) 
        ? "Le pH doit être entre 0 et 14" 
        : ""
    }
  />
</Grid>

{/* Champ pH Maximum */}
<Grid item xs={12} md={6}>
  <TextField
    fullWidth
    label="pH maximum"
    name="maxPh"
    type="number"
    value={formData.maxPh}
    onChange={(e) => {
      handleChange(e);
      let value = e.target.value;
      if (value !== '') {
        value = Math.max(0, Math.min(14, parseFloat(value)));
        value = parseFloat(value.toFixed(1)); // Limite à 1 décimale
      }
      setFormData({...formData, maxPh: value});
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <PhIcon color={
            formData.maxPh < 0 || formData.maxPh > 14 
              ? "error" 
              : "inherit"
          } />
        </InputAdornment>
      ),
    }}
    inputProps={{
      min: 0,
      max: 14,
      step: 0.1
    }}
    error={formData.maxPh < 0 || formData.maxPh > 14}
    helperText={
      (formData.maxPh < 0 || formData.maxPh > 14) 
        ? "Le pH doit être entre 0 et 14" 
        : ""
    }
  />
</Grid>
<Grid>
  <TextField
    select
    fullWidth
    label="waterTank"
    name="waterTank"
    value={formData.waterTank}
    onChange={handleChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
        </InputAdornment>
      ),
    }}
  >
    {waterTanks.map((tank) => (
      <MenuItem key={tank._id} value={tank._id}>
        {tank.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
<Grid>
  <TextField
    select
    fullWidth
    label="fertilizerTank"
    name="fertilizerTank"
    value={formData.fertilizerTank}
    onChange={handleChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
        </InputAdornment>
      ),
    }}
  >
    {fertilizerTanks.map((tank) => (
      <MenuItem key={tank._id} value={tank._id}>
        {tank.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
          {/* Bouton de soumission */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              fullWidth
              className="submit-button"
              startIcon={<AddIcon />}
            >
              Ajouter le Produit
            </Button>
          </Grid>

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

export default AddProduct;