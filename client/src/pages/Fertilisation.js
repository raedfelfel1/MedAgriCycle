import React, { useState, useEffect } from 'react';
import {
  Button,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  Slider,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  ShowChart as ShowChartIcon
} from '@mui/icons-material';
import '../contexts/styles/Fertilisation.css';
import BarSide from '../components/ui/BarSide';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import RemoveIcon from '@mui/icons-material/Remove';

// Composant pour l'onglet personnalisé
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Fertilisation = () => {
  const [dark, setDark] = useState(false);
  const [product, setProduct] = useState('NPK');
  const [fertiliserLevel, setFertiliserLevel] = useState({
    NPK: 100,
    Compost: 80,
    Fumier: 60
  });
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalUsed: 0,
    mostUsedProduct: 'NPK',
    dailyAverage: 0
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Charger l'historique depuis le localStorage au chargement
  useEffect(() => {
    const savedHistory = localStorage.getItem('fertilisationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
      calculateStats(JSON.parse(savedHistory));
    }
  }, []);

  // Calculer les statistiques
  const calculateStats = (historyData) => {
    if (historyData.length === 0) return;

    const totalUsed = historyData.reduce((sum, item) => sum + item.quantity, 0);

    // Trouver le produit le plus utilisé
    const productCount = {};
    historyData.forEach(item => {
      productCount[item.product] = (productCount[item.product] || 0) + item.quantity;
    });

    const mostUsedProduct = Object.keys(productCount).reduce((a, b) =>
      productCount[a] > productCount[b] ? a : b, 'NPK');

    // Calculer la moyenne quotidienne (sur 7 jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUsage = historyData.filter(item => new Date(item.date) > oneWeekAgo);
    const weeklyTotal = recentUsage.reduce((sum, item) => sum + item.quantity, 0);
    const dailyAverage = weeklyTotal / 7;

    setStats({
      totalUsed,
      mostUsedProduct,
      dailyAverage: Math.round(dailyAverage * 10) / 10
    });
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
      return;
    }
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
      setMessageType('error');
      setMessage("La valeur doit être un nombre entier.");
      setQuantity('');
    } else if (parsed < 0) {
      setQuantity(0);
    } else if (parsed > 100) {
      setQuantity(100);
    } else {
      setQuantity(parsed);
      setMessage('');
      setMessageType('');
    }
  };

  const handleSliderChange = (event, newValue) => {
    setQuantity(newValue);
  };

  const handleIncrement = () => {
    if (quantity === '') setQuantity(0);
    const newValue = Math.min(100, parseInt(quantity || 0) + 10);
    setQuantity(newValue);
  };

  const handleDecrement = () => {
    if (quantity === '') setQuantity(0);
    const newValue = Math.max(0, parseInt(quantity || 0) - 10);
    setQuantity(newValue);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const toUse = parseInt(quantity);
    if (isNaN(toUse) || toUse <= 0) {
      setMessageType('error');
      setMessage("Veuillez saisir une quantité valide.");
      return;
    }
    if (fertiliserLevel[product] - toUse >= 0) {
      // Mettre à jour les niveaux
      setFertiliserLevel(prev => ({ ...prev, [product]: prev[product] - toUse }));

      // Ajouter à l'historique
      const newHistoryItem = {
        date: new Date().toISOString(),
        product,
        quantity: toUse,
        remaining: fertiliserLevel[product] - toUse
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('fertilisationHistory', JSON.stringify(updatedHistory));

      // Calculer les nouvelles stats
      calculateStats(updatedHistory);

      setQuantity('');
      setMessageType('success');
      setMessage("Fertilisation réussie !");
    } else {
      setMessageType('error');
      setMessage("Quantité insuffisante pour ce produit.");
    }
  };

  const getProductColor = (productName) => {
    switch (productName) {
      case 'NPK': return '#3b82f6';
      case 'Compost': return '#10b981';
      case 'Fumier': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <BarSide />
      <div className={`fertilisation-page ${dark ? 'dark-theme' : 'light-theme'}`}>
        <Card className="fertilisation-card">
          <div className="fertilisation-header">
            <div className="title-section">
              <AgricultureIcon className="header-icon" />
              <Typography variant="h4" className="title">
                Contrôle de Fertilisation
              </Typography>
            </div>
          </div>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="tabs-container">
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab icon={<WaterDropIcon />} label="Contrôle" />
              <Tab icon={<HistoryIcon />} label="Historique" />
              <Tab icon={<BarChartIcon />} label="Statistiques" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3} className="dashboard-content">
              <Grid item xs={12} md={7}>
                <Paper elevation={2} className="tank-section">
                  <Typography variant="h6" className="section-title">
                    Niveaux des Réservoirs
                  </Typography>
                  <div className="tank-group">
                    {Object.entries(fertiliserLevel).map(([key, level]) => (
                      <div className="tank-item" key={key}>
                        <div className="tank-container">
                          <div className="tank">
                            <div
                              className="fill"
                              style={{
                                height: `${level}%`,
                                backgroundColor: getProductColor(key)
                              }}
                            >
                              <div className="water-wave"></div>
                            </div>
                            <div className="tank-overlay">
                              <WaterDropIcon />
                              <span className="level-text">{level}%</span>
                            </div>
                          </div>
                          <div className="tank-info">
                            <Typography variant="body1" className="tank-label">{key}</Typography>
                            <Typography variant="body2" className="tank-volume">{level} L restants</Typography>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={12} md={5}>
                <Paper elevation={2} className="control-section">
                  <Typography variant="h6" className="section-title">
                    Configuration
                  </Typography>

                  <FormControl fullWidth className="select-field">
                    <InputLabel>Produit</InputLabel>
                    <Select
                      value={product}
                      label="Produit"
                      onChange={(e) => setProduct(e.target.value)}
                    >
                      <MenuItem value="NPK">NPK</MenuItem>
                      <MenuItem value="Compost">Compost</MenuItem>
                      <MenuItem value="Fumier">Fumier</MenuItem>
                    </Select>
                  </FormControl>

                  <div className="quantity-control">
                    <Typography variant="body1" gutterBottom>
                      Quantité à utiliser (litres)
                    </Typography>
                    <div className="slider-container">
                      <Slider
                        value={quantity === '' ? 0 : quantity}
                        onChange={handleSliderChange}
                        aria-labelledby="quantity-slider"
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                        color="primary"
                      />
                    </div>
                    <div className="quantity-input-group">
                      <Button
                        variant="outlined"
                        className="quantity-btn"
                        onClick={handleDecrement}
                      >
                        <RemoveIcon />
                      </Button>
                      <input
                        type="number"
                        value={quantity}
                        min={0}
                        max={100}
                        onChange={handleChange}
                        className="quantity-input"
                      />
                      <Button
                        variant="outlined"
                        className="quantity-btn"
                        onClick={handleIncrement}
                      >
                        <AddIcon />
                      </Button>
                    </div>
                  </div>

                  {message && (
                    <Alert
                      severity={messageType}
                      className={`message ${messageType}`}
                      onClose={() => {
                        setMessage('');
                        setMessageType('');
                      }}
                    >
                      {message}
                    </Alert>
                  )}

                  <Button
                    onClick={handleClick}
                    variant="contained"
                    color="primary"
                    className="fertilize-btn"
                    disabled={!quantity || quantity <= 0}
                    fullWidth
                    size="large"
                  >
                    Fertiliser Maintenant
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper elevation={2} className="history-section">
              <Typography variant="h6" className="section-title">
                Historique des Fertilisations
              </Typography>

              {history.length === 0 ? (
                <div className="empty-state">
                  <HistoryIcon className="empty-icon" />
                  <Typography variant="body1" className="empty-text">
                    Aucune fertilisation enregistrée
                  </Typography>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item, index) => (
                    <div key={index} className="history-item">
                      <div className="history-color" style={{ backgroundColor: getProductColor(item.product) }}></div>
                      <div className="history-details">
                        <Typography variant="body1" className="history-product">
                          {item.product}
                        </Typography>
                        <Typography variant="body2" className="history-date">
                          {formatDate(item.date)}
                        </Typography>
                      </div>
                      <div className="history-values">
                        <Typography variant="body1" className="history-quantity">
                          -{item.quantity} L
                        </Typography>
                        <Typography variant="body2" className="history-remaining">
                          Restant: {item.remaining} L
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Paper elevation={2} className="stats-section">
              <Typography variant="h6" className="section-title">
                Statistiques de Fertilisation
              </Typography>

              <Grid container spacing={3} className="stats-grid">
                <Grid item xs={12} md={4}>
                  <div className="stat-card">
                    <div className="stat-icon total-used">
                      <ShowChartIcon />
                    </div>
                    <Typography variant="h4" className="stat-value">
                      {stats.totalUsed} L
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Total utilisé
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <div className="stat-card">
                    <div className="stat-icon daily-avg">
                      <CalendarTodayIcon />
                    </div>
                    <Typography variant="h4" className="stat-value">
                      {stats.dailyAverage} L
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Moyenne quotidienne
                    </Typography>
                  </div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <div className="stat-card">
                    <div className="stat-icon popular-product">
                      <TrendingUpIcon />
                    </div>
                    <Typography variant="h4" className="stat-value">
                      {stats.mostUsedProduct}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Produit le plus utilisé
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <div className="product-usage">
                <Typography variant="h6" className="usage-title">
                  Utilisation par produit
                </Typography>
                <div className="usage-bars">
                  {Object.entries(fertiliserLevel).map(([key, level]) => {
                    const initialLevel = key === 'NPK' ? 100 : key === 'Compost' ? 80 : 60;
                    const used = initialLevel - level;
                    const percentage = (used / initialLevel) * 100;

                    return (
                      <div key={key} className="usage-item">
                        <div className="usage-info">
                          <span className="usage-product">{key}</span>
                          <span className="usage-amount">{used} L / {initialLevel} L</span>
                        </div>
                        <div className="usage-bar">
                          <div
                            className="usage-progress"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: getProductColor(key)
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Paper>
          </TabPanel>
        </Card>
      </div>
    </>
  );
};

export default Fertilisation;