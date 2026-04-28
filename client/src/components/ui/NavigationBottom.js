
import React, { useState, useEffect } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import '../../contexts/styles/NavigationBottom.css';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import { fetchFarmsByUser } from '../../services/api';

const NavigationBottom = ({ onFarmSelect, selectedFarmId }) => {
  const [farms, setFarms] = useState([]);
  const [value, setValue] = useState(selectedFarmId || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await fetchFarmsByUser(userId);
        setFarms(data);
        if (data.length > 0) {
          const firstFarmId = data[0]._id;
          setValue(firstFarmId);
          localStorage.setItem("farmId", firstFarmId); // ⬅️ Stocke l'ID de la première ferme
          onFarmSelect?.(firstFarmId);
        }
      } catch (err) {
        setError(err.message);
        setFarms([]);
      } finally {
        setLoading(false);
      }
    };
    loadFarms();
  }, [onFarmSelect, userId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 'add') {
      localStorage.setItem("farmId", newValue); // ✅ Met à jour farmId dans localStorage
      window.dispatchEvent(new Event("farmIdChanged")); // ✅ notification
      onFarmSelect?.(newValue);
    }
  };

  const handleClick = () => {
    navigate('/ajoutFerme');
  };

  return (
    <div className="bottom-navigation">
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}
        sx={{
          '& .MuiBottomNavigationAction-root': { color: 'gray' },
          '& .Mui-selected': {
            color: 'green',
            fontSize: '0.75rem',
            backgroundColor: '#00FF00',
            borderRadius: 2,
          },
        }}
      >
        {farms.map((farm) => (
          <BottomNavigationAction
            key={farm._id}
            value={farm._id}
            label={farm.name}
            icon={<AgricultureIcon color="success" />}
            sx={{ minWidth: 100, flexGrow: 1 }}
          />
        ))}

        <BottomNavigationAction
          label="Ajouter"
          value="add"
          icon={<AddCircleIcon color="success" />}
          onClick={handleClick}
          sx={{ minWidth: 100, flexGrow: 1 }}
        />
      </BottomNavigation>

      {loading && <p className="loading-message">Chargement des fermes...</p>}
      {error && <p className="error-message">Erreur : {error}</p>}
    </div>
  );
};

export default NavigationBottom;
