import React, { useState, useEffect } from 'react';
import BarSide from '../components/ui/BarSide';
import styles from '../contexts/styles/Board.module.css';
import AdvancementChart from '../components/ui/AdvancementChart';
import CombinedChart from '../components/ui/CombinedChart';
import { fetchFarmsByUser,fetchProductsByFarm,fetchSensorsByProduct } from '../services/api';
import HistoriqueDownload from './HistoriqueDownload';
import { Button, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Board = () => {

  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const [products,setProducts]=useState([]);
  const [selectedProduct,setSelectedProduct]=useState(null);

  const [sensors,setSensors]=useState(null);
  const [selectedsensor,setSelectedSensors]=useState(null);

  const [hour,setHour]=useState('24');

  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

useEffect(() => {
  if (!userId) {
    setError("Utilisateur non identifié");
    setLoading(false);
    return;
  }

  const loadFarms = async () => {
    try {
      setLoading(true);
      const userFarms = await fetchFarmsByUser(userId);
      setFarms(userFarms);

      if (userFarms.length > 0) {
        setSelectedFarm(userFarms[0]._id);
      setProducts([]);

      } else {
        setError("Aucune ferme trouvée pour cet utilisateur");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des fermes:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  loadFarms();
}, [userId]);


useEffect(() => {
  if (!selectedFarm) return;

  const loadProducts = async () => {
    try {
      setLoading(true);

      setProducts([]);
      setSelectedProduct(null);
      setSensors([]);
      setSelectedSensors(null);

      const products = await fetchProductsByFarm(selectedFarm);

      if (products.data.length > 0) {
        setSelectedProduct(products.data[0]._id);
      }

      setProducts(products.data);
    } catch (error) {
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [selectedFarm]);


useEffect(() => {
  
  const loadSensors = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);

      setSensors(null);
      setSelectedSensors(null);
      const sensors = await fetchSensorsByProduct(selectedProduct);
      if (sensors.length > 0) {
        setSelectedSensors(sensors[0]._id);
      }

      setSensors(sensors);

    } catch (error) {
      setError("Erreur lors du chargement des capteurs");
    } finally {
      setLoading(false);
    }
  };

  loadSensors();
}, [selectedProduct,hour]);

  const toggleHistoryView = () => {
    setShowHistory(prev => !prev);
  };

  const handleBackFromHistory = () => {
    setShowHistory(false);
  };

  if (loading) {
    return (
      <>
        <BarSide />
        <div className={styles.boardContainer}>
          <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <Typography variant="h6">Chargement des données...</Typography>
          </Box>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BarSide />
        <div className={`${styles.boardPageContainer}`}>
          <div className={styles.boardContainer}>
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
              <Typography variant="h6" color="error">{error}</Typography>
            </Box>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {!showHistory && <BarSide />}
      <div className={`${styles.boardPageContainer} ${showHistory ? styles.fullWidth : ''}`}>
        {showHistory ? (
          <HistoriqueDownload onBack={handleBackFromHistory} />
        ) : (
          <div className={styles.boardContainer}>
            <div className={styles.headerContainer}>
              <Typography variant="h4" component="h2">
                📊 Tableau de bord des capteurs
              </Typography>
              <div>
                <Button 
                  variant="outlined" 
                  onClick={toggleHistoryView}
                  color="primary"
                  sx={{
                    backgroundColor: '#78d37dff', 
                    color: 'white',
                    padding: '1vh',
                    paddingBottom:"1%",
                    fontWeight: '600',
                    fontSize: '16px',
                    borderRadius: '8px',
                    textTransform: 'none',
                    boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#a6dfaaff', 
                      boxShadow: '0 5px 8px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Voir l'historique
                </Button>
              </div>
          </div>
  <div>
    <div className={styles.optionsBtns}>
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
        <InputLabel id="farm-select-label" sx={{ 
          fontSize: '16px',
          transform: 'translate(14px, 14px) scale(1)',
          '&.Mui-focused, &.MuiFormLabel-filled': {
            transform: 'translate(14px, -9px) scale(0.75)'
          }
        }}>Farm
        </InputLabel>
        <Select
          labelId="farm-select-label"
          id="farm-select"
          value={selectedFarm || ''}
          label="Sélectionnez une ferme"
          onChange={(e) => setSelectedFarm(e.target.value)}
          sx={{
            height: 48, 
            fontSize: '16px',
            '& .MuiSelect-select': {
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center'
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300, // Hauteur maximale du menu déroulant
                '& .MuiMenuItem-root': {
                  fontSize: '15px',
                  padding: '10px 16px',
                  minHeight: 'auto'
                }
              }
            }
          }}
        >
          {farms.map((farm) => (
            <MenuItem 
              key={farm._id} 
              value={farm._id}
              sx={{
                fontSize: '15px',
                padding: '10px 16px'
              }}
            >
              {farm.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        {/* select product of farm */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
          <InputLabel>Product
        </InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={selectedProduct || 'null'}
          label="Sélectionnez un produit"
          onChange={(e) => setSelectedProduct(e.target.value)}
          sx={{
            height: 48,
            fontSize: '16px',
            '& .MuiSelect-select': {
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 300,
                '& .MuiMenuItem-root': {
                  fontSize: '15px',
                  padding: '10px 16px',
                  minHeight: 'auto',
                },
              },
            },
          }}
          >
          {products.length === 0 ? (
            <MenuItem disabled value="null">Aucun produit disponible</MenuItem>
          ) : (
          products.map((product) => (
            <MenuItem
              key={product._id}
              value={product._id}
              sx={{
              fontSize: '15px',
              padding: '10px 16px',
              }}
              >
              {product.name}
            </MenuItem>
          ))
          )}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 400 }}>
        <InputLabel>
          Time
        </InputLabel>
        <Select
          labelId="hour-select-label"
          id="hour-select"
          value={hour || ''}
          label="Sélectionnez un produit"
          onChange={(e) => setHour(e.target.value)}
          sx={{
          height: 48,
          fontSize: '16px',
          '& .MuiSelect-select': {
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            },
          }}
          MenuProps={{
            PaperProps: {
            sx: {
              maxHeight: 300,
              '& .MuiMenuItem-root': {
                fontSize: '15px',
                padding: '10px 16px',
                minHeight: 'auto',
              },
            },
            },
          }}
          >
          <MenuItem value="24">jour</MenuItem>
          <MenuItem value="168">semaine</MenuItem>
          <MenuItem value="720">mois</MenuItem>
          <MenuItem value="8766">année</MenuItem>
          <MenuItem value="live">temps réel</MenuItem>
        </Select>
      </FormControl>
    </div>
      </div>

        <div className={styles.chartsFlex}>

          <div className={styles.chartsGrid}>

            <div className={styles.chartCard}>

              {/* <TemperatureChart sensorId={"698ef738241c007888736ec8"} /> */}
              <AdvancementChart sensorId={selectedsensor} type={"temperature"} hour={hour} time={15000}/>
            </div>

            <div className={styles.chartCard}>
              {/* <HumidityChart farmId={selectedFarm} /> */}
              <AdvancementChart sensorId={selectedsensor} type={"humidity"} hour={hour} time={15000}/>
            </div>

            <div className={styles.chartCard}>
              {/* <PhChart farmId={selectedFarm} /> */}
              <AdvancementChart sensorId={selectedsensor} type={"Ph"} hour={hour} time={15000}/>
            </div>

            <div className={styles.chartCard}>
              {/* <PhChart farmId={selectedFarm} /> */}
              <AdvancementChart sensorId={selectedsensor} type={"conductivity"} hour={hour} time={15000}/>
            </div>
            <div className={`${styles.chartCard} ${styles.fullWidth} ${styles.combinedChartContainer}`}>
              <CombinedChart sensorId={selectedsensor} hour={hour} time={15000}/>
            </div>
          </div>
        </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Board;

