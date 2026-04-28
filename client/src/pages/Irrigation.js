import React, { useState, useEffect } from 'react';
import {
  Button,
  Switch,
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Alert,
  Slider,
  IconButton,
  Paper,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  WaterDrop as WaterDropIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Opacity as OpacityIcon,
  Autorenew as AutorenewIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import BarSide from '../components/ui/BarSide';
import '../contexts/styles/Irrigation.css';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const Irrigation = () => {
  const { darkMode } = useAppTheme();
  //const [darkMode, setDarkMode] = useState(false);
  const [waterLevel, setWaterLevel] = useState(85);
  const [irrigationAmount, setIrrigationAmount] = useState(15);
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [autoRefill, setAutoRefill] = useState(true);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [selectedTab, setSelectedTab] = useState('control');
  const [irrigationHistory, setIrrigationHistory] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Charger l'historique depuis le localStorage au chargement du composant
  useEffect(() => {
    const savedHistory = localStorage.getItem('irrigationHistory');
    if (savedHistory) {
      try {
        setIrrigationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Erreur lors du parsing de l'historique:", e);
        setIrrigationHistory([]);
      }
    }

    const savedWaterLevel = localStorage.getItem('waterLevel');
    if (savedWaterLevel) {
      setWaterLevel(Number(savedWaterLevel));
    }

    const savedAutoRefill = localStorage.getItem('autoRefill');
    if (savedAutoRefill) {
      setAutoRefill(savedAutoRefill === 'true');
    }
  }, []);

  // Sauvegarder l'historique dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('irrigationHistory', JSON.stringify(irrigationHistory));
  }, [irrigationHistory]);

  // Sauvegarder le niveau d'eau
  useEffect(() => {
    localStorage.setItem('waterLevel', waterLevel.toString());
  }, [waterLevel]);

  // Sauvegarder l'état du remplissage automatique
  useEffect(() => {
    localStorage.setItem('autoRefill', autoRefill.toString());
  }, [autoRefill]);

  // Effet pour le mode sombre supprimé car géré globalement

  // Simulation de remplissage automatique
  useEffect(() => {
    let refillInterval;
    if (autoRefill && waterLevel < 100) {
      refillInterval = setInterval(() => {
        setWaterLevel(prev => Math.min(prev + 0.5, 100));
      }, 5000);
    }
    return () => clearInterval(refillInterval);
  }, [autoRefill, waterLevel]);

  const handleSliderChange = (event, newValue) => {
    setIrrigationAmount(newValue);
  };

  const handleInputChange = (event) => {
    const value = Math.max(0, Math.min(100, Number(event.target.value)));
    setIrrigationAmount(value);
  };

  const handleIrrigation = () => {
    if (waterLevel - irrigationAmount >= 0) {
      setIsIrrigating(true);
      setMessage({ text: "Irrigation en cours...", severity: "info" });

      // Simulation du processus d'irrigation
      setTimeout(() => {
        const newWaterLevel = waterLevel - irrigationAmount;
        setWaterLevel(newWaterLevel);

        const newHistoryItem = {
          amount: irrigationAmount,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString(),
          success: true
        };

        setIrrigationHistory(prev => [newHistoryItem, ...prev]);
        setMessage({
          text: `Irrigation de ${irrigationAmount}L réussie !`,
          severity: "success"
        });
        setIsIrrigating(false);
      }, 2000);
    } else {
      setMessage({
        text: "Niveau d'eau insuffisant pour cette opération.",
        severity: "error"
      });
    }
  };

  const handleReset = () => {
    setWaterLevel(100);
    setMessage({
      text: "Réservoir réinitialisé à 100L",
      severity: "info"
    });
  };

  const clearHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer tout l'historique ?")) {
      setIrrigationHistory([]);
      setMessage({
        text: "Historique effacé avec succès",
        severity: "info"
      });
    }
  };

  const WaterTank = styled(Box)(({ theme, waterlevel }) => ({
    position: 'relative',
    width: 100,
    height: 160,
    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
    margin: '0 auto',
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: `${waterlevel}%`,
      background: waterlevel < 20
        ? 'linear-gradient(to top, #ff5252, #ff7b7b)'
        : 'linear-gradient(to top, #2196f3, #64b5f6)',
      transition: 'height 0.5s ease',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '5px',
      background: 'rgba(255, 255, 255, 0.5)',
      animation: 'water-shimmer 3s infinite linear',
    }
  }));

  return (
    <>
      <BarSide />
      <Box className="irrigation-dashboard">
        <Card className="dashboard-card">
          <CardContent>
            {/* Header */}
            <Box className="dashboard-header">
              <Box display="flex" alignItems="center">
                <WaterDropIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
                <Typography variant="h4" component="h1" fontWeight="600">
                  Système d'Irrigation
                </Typography>
              </Box>
            </Box>

            {/* Navigation Tabs */}
            <Box className="tab-navigation">
              <Chip
                icon={<WaterDropIcon />}
                label="Contrôle"
                onClick={() => setSelectedTab('control')}
                color={selectedTab === 'control' ? 'primary' : 'default'}
                variant={selectedTab === 'control' ? 'filled' : 'outlined'}
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<HistoryIcon />}
                label="Historique"
                onClick={() => setSelectedTab('history')}
                color={selectedTab === 'history' ? 'primary' : 'default'}
                variant={selectedTab === 'history' ? 'filled' : 'outlined'}
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<TrendingUpIcon />}
                label="Statistiques"
                onClick={() => setSelectedTab('analytics')}
                color={selectedTab === 'analytics' ? 'primary' : 'default'}
                variant={selectedTab === 'analytics' ? 'filled' : 'outlined'}
              />
            </Box>

            {selectedTab === 'control' && (
              <Grid container spacing={3} sx={{ mt: 0 }}>
                {/* Water Tank Visualization */}
                <Grid item xs={12} md={5}>
                  <Paper className="info-panel" elevation={2}>
                    <Typography variant="h6" gutterBottom className="panel-title">
                      Réservoir d'eau
                    </Typography>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <WaterTank waterlevel={waterLevel}>
                        <Box className="water-level-indicator">
                          <Typography variant="h6" fontWeight="bold">
                            {waterLevel}%
                          </Typography>
                        </Box>
                      </WaterTank>
                      <Box className="water-info">
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                          <Typography variant="body1">
                            Capacité:
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {waterLevel}L / 100L
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                          {waterLevel < 20 ? <WarningIcon color="error" /> : <OpacityIcon color="primary" />}
                          <Typography
                            variant="body2"
                            color={waterLevel < 20 ? "error" : "textSecondary"}
                            sx={{ ml: 1 }}
                          >
                            {waterLevel < 20 ? "Niveau critique!" : "Niveau normal"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box className="tank-controls">
                      <Button
                        variant="outlined"
                        startIcon={<AutorenewIcon />}
                        onClick={handleReset}
                        fullWidth
                      >
                        Remplir le réservoir
                      </Button>
                      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          Remplissage auto
                        </Typography>
                        <Switch
                          checked={autoRefill}
                          onChange={(e) => setAutoRefill(e.target.checked)}
                          color="primary"
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {/* Irrigation Control */}
                <Grid item xs={12} md={7}>
                  <Paper className="control-panel" elevation={2}>
                    <Typography variant="h6" gutterBottom className="panel-title">
                      Contrôle d'irrigation
                    </Typography>

                    <Box className="irrigation-controls">
                      <Typography gutterBottom>
                        Quantité à irriguer (litres)
                      </Typography>
                      <Slider
                        value={irrigationAmount}
                        onChange={handleSliderChange}
                        aria-labelledby="irrigation-slider"
                        min={0}
                        max={Math.min(100, waterLevel)}
                        valueLabelDisplay="auto"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        value={irrigationAmount}
                        onChange={handleInputChange}
                        type="number"
                        inputProps={{
                          min: 0,
                          max: 100,
                          step: 5
                        }}
                        fullWidth
                        sx={{ mb: 3 }}
                      />

                      <Button
                        variant="contained"
                        onClick={handleIrrigation}
                        disabled={waterLevel === 0 || irrigationAmount === 0 || isIrrigating}
                        size="large"
                        startIcon={isIrrigating ? <WaterDropIcon /> : <WaterDropIcon />}
                        fullWidth
                        className="irrigate-button"
                      >
                        {isIrrigating ? "Irrigation en cours..." : `Irriguer ${irrigationAmount}L`}
                      </Button>

                      {message.text && (
                        <Alert severity={message.severity} sx={{ mt: 2 }}>
                          {message.text}
                        </Alert>
                      )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Quick Actions */}
                    <Typography variant="subtitle1" gutterBottom>
                      Actions rapides
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {[5, 10, 15, 20].map(amount => (
                        <Button
                          key={amount}
                          variant="outlined"
                          onClick={() => setIrrigationAmount(amount)}
                          size="small"
                          className="quick-action-btn"
                        >
                          {amount}L
                        </Button>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {selectedTab === 'history' && (
              <Paper className="history-panel" elevation={2} sx={{ p: 3, mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" className="panel-title">
                    Historique d'irrigation
                  </Typography>

                </Box>
                {irrigationHistory.length > 0 ? (
                  <Box>
                    {irrigationHistory.map((item, index) => (
                      <Box key={index} className="history-item" sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center">
                            <WaterDropIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1" fontWeight="medium">
                              Irrigation de {item.amount}L
                            </Typography>
                          </Box>
                          <Chip
                            label={item.success ? "Réussi" : "Échec"}
                            size="small"
                            color={item.success ? "success" : "error"}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          Le {item.date} à {item.timestamp}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                    Aucune irrigation effectuée pour le moment
                  </Typography>
                )}
              </Paper>
            )}

            {selectedTab === 'analytics' && (
              <Paper className="analytics-panel" elevation={2} sx={{ p: 3, mt: 2 }}>
                <Typography variant="h5" gutterBottom className="panel-title">
                  Statistiques d'irrigation
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }} elevation={1}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {irrigationHistory.length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Irrigations totales
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }} elevation={1}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {irrigationHistory.reduce((total, item) => total + item.amount, 0)}L
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Volume total
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }} elevation={1}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {waterLevel}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Niveau actuel
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center' }} elevation={1}>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {autoRefill ? 'Activé' : 'Désactivé'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Remplissage auto
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Irrigation;