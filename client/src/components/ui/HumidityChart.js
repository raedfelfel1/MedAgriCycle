import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import {fetchSensorHistory} from '../../services/api';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);


const HumidityChart = (farmId) => {
  const [humidityData, setHumidityData] = useState([]);
  const[isLoading,setIsLoading]=useState(true);
  
    useEffect(()=>{
      const loadData = async () => {
            try {
              const data = await fetchSensorHistory(farmId,24); // on utilise la version avec paramètre
              setHumidityData(data.reverse()); // du plus ancien au plus récent
            } catch (error) {
              console.error('Erreur lors du chargement des données :', error.message);
            } finally {
              setIsLoading(false);
            }
          };
      
          loadData();
    },[]);
  
  

  const chartData = {
    labels: humidityData.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Humidité (%)',
        data: humidityData.map(d => d.humidity),
        fill: false,
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        tension: 0.3,
        pointRadius: 2,
      }
    ]
  };

  const options = {
    scales: {
      x: { type: 'time', time: { unit: 'hour' } },
      y: { title: { display: true, text: 'Humidité (%)' }, min: 20, max: 100 }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
      <h2>Humidité sur 24h</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HumidityChart;
