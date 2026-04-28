import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  Snackbar,
  Alert,
  Input
} from '@mui/material';
import { fetchSensorsByFarm, createSensor, deleteSensor, fetchSensorsByUser,fetchProductsByUserId, updateSensor } from '../../services/api';
import '../../contexts/styles/Sensor.css';
import { useNavigate } from 'react-router-dom';

const Sensor = () => {
  const [availableSensors,setAvailableSensors]=useState([]);
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editMode,setEditMode]=useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [isNew,setIsNew]=useState(false);
  const [userProducts,setUserProducts] = useState([]);
  const [newSensor, setNewSensor] = useState({
    sensor_id: '',
    ip_address: '',
    type: '',
    status: 'active',
    latitude: '',
    longitude: '',
    unit: ''
  });
  const[editedSensor,setEditedSensor]=useState({
    sensor_id: '',
    ip_address: '',
    type: '',
    status: 'active',
    latitude: '',
    longitude: '',
    unit: ''
  });
  const resetEditedSensor=()=>{
    setEditedSensor({
      sensor_id: '',
      ip_address: '',
      type: '',
      status: 'active',
      latitude: '',
      longitude: '',
      unit: ''
    })
  }
  useEffect(()=>{
    console.log("edit:",editedSensor)
  },[editedSensor])
  const handleEditSensor=async()=>{
    const {_id,latitude,longitude,...data}=editedSensor
    
    const sendSensor={
      location:{longitude,latitude},...data
    }
    try {
      if(_id){
        setSnackbar({ open: true, message: "Capteur modifié avec succès", severity: 'success' });
        setOpenAdd(false)
        await updateSensor(_id,sendSensor)
      }
      else{
        const found = availableSensors.find(sensor=>sensor.sensor_id === editedSensor.sensor_id)
        await updateSensor(found._id,sendSensor)
        setOpenAdd(false)
        setSnackbar({ open: true, message: "Capteur assigné avec succès", severity: 'success' });
      }
      loadSensors(userId);
      loadUserSensors(userId);
    } catch (error) {
      console.error(error.message);
      setSnackbar({ open: true, message: "Erreur suppression capteur : " + error.message, severity: 'error' });
    }
  }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, sensorId: null });

  const navigate = useNavigate();
  const farmId = localStorage.getItem("farmId");
  const userId = localStorage.getItem("userId");
  const loadUserProducts = async(userId)=>{
    try {
      const products = await fetchProductsByUserId(userId);
      setUserProducts(products);
    } catch (error) {
      console.error(`${error.message}`);
    }
  }
  useEffect(()=>{
    loadUserProducts(userId);
  },[])
  // 🔒 Fonction pour échapper les caractères spéciaux 
  const sanitizeInput = (str) => {
    if (!str) return '';
    return str.replace(/[&<>"'/]/g, (char) => {
      const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
      };
      return escapeChars[char];
    });
  };

  const confirmDeleteSensor = async () => {
    const id = confirmDelete.sensorId;
    try {
      const reset={
        id,
        location:{
          latitude:0,
          longitude:0,
        },
        status:"inactive",
        product:null
      }
      await updateSensor(id,reset);
      loadSensors();
      loadUserSensors(userId);
      setSnackbar({ open: true, message: "Capteur supprimé", severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: "Erreur suppression capteur : " + err.message, severity: 'error' });
    } finally {
      setConfirmDelete({ open: false, sensorId: null });
      setIsNew(false);
    }
  };

  const cancelDeleteSensor = () => {
    setConfirmDelete({ open: false, sensorId: null });
  };
  const loadUserSensors = async(userId)=>{
      try {
        const sensors = await fetchSensorsByUser(userId)
        console.log("test",sensors)
        setAvailableSensors(sensors.filter(sensor=>sensor.product==null))
      } catch (error) {
        console.error(`${error.message}`)
      }
    }
    useEffect(()=>{
      loadUserSensors(userId);
    },[])
  // 🔄 Charger les capteurs
  const loadSensors = async () => {
    try {
      const data = await fetchSensorsByFarm(farmId);
      setSensors([...data.data]);
      setFilteredSensors(data.data);
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: "Erreur chargement capteurs : " + err.message, severity: 'error' });
      setSensors([]);
      setFilteredSensors([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSensors();
  }, [farmId]);

  // 🔄 Filtrage
  useEffect(() => {
    let filtered = sensors;
    if (filterType) filtered = filtered.filter(s => s.type === filterType);
    if (filterStatus) filtered = filtered.filter(s => s.status === filterStatus);
    setFilteredSensors(filtered);
  }, [filterType, filterStatus, sensors]);

  // 🔄 Réinitialiser filtres
  const handleResetFilters = () => {
    setFilterType('');
    setFilterStatus('');
  };

// if (!editedSensor.sensor_id || !editedSensor.type || !editedSensor.latitude || !editedSensor.longitude) {
//       setSnackbar({ open: true, message: "Veuillez remplir tous les champs obligatoires", severity: 'error' });
//       return;
//     }
//     if (isNaN(editedSensor.latitude) || isNaN(editedSensor.longitude)) {
//       setSnackbar({ open: true, message: "Latitude et Longitude doivent être des nombres valides", severity: 'error' });
//       return;
//     }

  // 🗑 Supprimer un capteur
  const requestDeleteSensor = (id) => {
    setConfirmDelete({ open: true, sensorId: id });
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (loading) return <div className="sensor-message">Chargement des capteurs...</div>;
  if (error) return <div className="sensor-message">Erreur : {error}</div>;

  return (
    <div className="sensor-container">
      <Typography variant="h5" className="sensor-title">Gérer les capteurs</Typography>

      <div className="sensor-filters">
        <TextField
          select
          label="Type de capteur"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          variant="outlined"
          size="small"
          className="sensor-select"
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(sensors.map(s => s.type))].map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Statut"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          variant="outlined"
          size="small"
          className="sensor-select"
        >
          <MenuItem value="">Tous</MenuItem>
          {[...new Set(sensors.map(s => s.status))].map(status => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>

        <Button variant="outlined" onClick={handleResetFilters} className="sensor-reset-button">
          Réinitialiser les filtres
        </Button>

        <Button variant="contained" color="primary" onClick={() => {setOpenAdd(true); setIsNew(true);}}>
          Ajouter un capteur
        </Button>
      </div>

      {filteredSensors.length === 0 ? (
        <div className="sensor-message">Aucun capteur ne correspond aux filtres</div>
      ) : (
        <div className="liste-capteurs">
          {filteredSensors.map(sensor => {
            const {_id,sensor_id,ip_address,type,status,location,unit} = sensor
            const currentSensor={
              _id,
              sensor_id,
              ip_address,
              latitude:location.latitude,
              longitude:location.longitude,
              unit,
              status,
              type,
              ip_address
            }
            return( 
              <Card key={sensor._id} className="capteur-item" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography><strong>ID:</strong> {sensor.sensor_id}</Typography>
                  {editMode?
                    <>
                    
                      <Typography component="div"><strong>Latitude:</strong> <Input defaultValue={sensor.location.latitude}/></Typography>
                      <Typography component="div"><strong>Longitude:</strong> <Input defaultValue={sensor.location.longitude}/></Typography>
                      <Typography component="div"><strong>Statut:</strong> <Input defaultValue={sensor.status}/></Typography>
                      <Typography component="div"><strong>product:</strong> 
                        <TextField select value={sensor.product?sensor.product:""}>
                          <MenuItem value={``}>Aucun</MenuItem>
                          {userProducts.map(product=>
                            <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                          )}
                        </TextField>
                      </Typography>
                      <Typography component="div"><strong>Unit:</strong> <Input defaultValue={sensor.unit || '-'}/></Typography>
                    </>
                    :
                    <>
                      <Typography><strong>Latitude:</strong> {sensor.location.latitude}</Typography>
                      <Typography><strong>Longitude:</strong> {sensor.location.longitude}</Typography>
                      <Typography><strong>Statut:</strong> {sensor.status}</Typography>
                      <Typography><strong>product:</strong> {sensor.product?sensor.product.name:"no product link"}</Typography>
                      <Typography><strong>Unit:</strong> {sensor.unit || '-'}</Typography>
                    </>
                  }
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => requestDeleteSensor(sensor._id)}
                    sx={{ mt: 1 }}
                  >
                    Supprimer
                  </Button>
                  {editMode?<>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setEditMode(false)}
                    sx={{ mt: 1 }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => setEditMode(false)}
                    sx={{ mt: 1 }}
                  >
                    confirmer
                  </Button>
                  </>
                  :<Button
                    variant="outlined"
                    color="success"
                    onClick={() => {setEditedSensor(currentSensor);setOpenAdd(true); setIsNew(false);}}
                    sx={{ mt: 1 }}
                  >
                    Modifier
                  </Button>}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog d'ajout */}
      <Dialog open={openAdd} onClose={() => {setOpenAdd(false);resetEditedSensor();}}>
        <DialogTitle>Paramètrer un capteur</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {isNew?
            <TextField label="Adresse MAC" select value={editedSensor.sensor_id} onChange={(e) => setEditedSensor({ ...editedSensor, sensor_id: e.target.value })}>
              {availableSensors.map(sensor=><MenuItem value={sensor.sensor_id}>{sensor.sensor_id}</MenuItem>)}
            </TextField>:
            <TextField label="Adresse MAC" value={editedSensor.sensor_id}>
            </TextField>
          }
          <TextField label="Statut" select value={editedSensor.status} onChange={(e) => setEditedSensor({ ...editedSensor, status: e.target.value })}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
          <TextField label="Produit" select value={editedSensor?.product?._id} onChange={(e)=>(setEditedSensor({...editedSensor,product:e.target.value}))}>
                        <MenuItem value={``}>Aucun</MenuItem>
                        {userProducts.map(product=>{
                          console.log("sensor",sensors)
                          if(sensors.some(sensor=>sensor.product._id===product._id)) return
                           return <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>}
                        )}
          </TextField>
          <TextField label="Latitude" value={editedSensor.latitude} onChange={(e) =>{setEditedSensor({ ...editedSensor, latitude: e.target.value });}} />
          <TextField label="Longitude" value={editedSensor.longitude} onChange={(e) => setEditedSensor({ ...editedSensor, longitude: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Annuler</Button>
          <Button onClick={handleEditSensor} variant="contained">Confirmer</Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Paramètrer un capteur</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Adresse MAC" select value={newSensor.sensor_id} onChange={(e) => setNewSensor({ ...newSensor, sensor_id: e.target.value })}>
            {availableSensors.map(sensor=><MenuItem value={sensor.sensor_id}>{sensor.sensor_id}</MenuItem>)}
          </TextField>
          <TextField label="Statut" select value={newSensor.status} onChange={(e) => setNewSensor({ ...newSensor, status: e.target.value })}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
          <TextField label="Latitude" value={newSensor.latitude} onChange={(e) => setNewSensor({ ...newSensor, latitude: e.target.value })} />
          <TextField label="Longitude" value={newSensor.longitude} onChange={(e) => setNewSensor({ ...newSensor, longitude: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Annuler</Button>
          <Button onClick={handleAddSensor} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog> */}

      {/* Snackbar pour suppression */}
      <Snackbar
        open={confirmDelete.open}
        autoHideDuration={6000}
        onClose={cancelDeleteSensor}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={cancelDeleteSensor}
          severity="warning"
          sx={{ width: '100%' }}
          action={
            <>
              <Button color="inherit" size="small" onClick={confirmDeleteSensor}>
                Oui
              </Button>
              <Button color="inherit" size="small" onClick={cancelDeleteSensor}>
                Non
              </Button>
            </>
          }
        >
          Voulez-vous vraiment supprimer ce capteur ?
        </Alert>
      </Snackbar>

      {/* Snackbar pour messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Sensor;


