import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fetchSensorHistory } from '../../services/api';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);

const TemperatureChart = ({sensorId}) => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensorHistory(sensorId,24); // on utilise la version avec paramètre
        setTemperatureData(data.reverse()); // du plus ancien au plus récent
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  

 //Deboggage
 console.log(temperatureData);

  const chartData = {
    labels: temperatureData.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Température (°C)',
        data: temperatureData.map(d => d.temperature),
        fill: false,
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        tension: 0.3,
        pointRadius: 2,
      }
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
        title: {
          display: true,
          text: 'Heure',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Température (°C)',
        },
        min: 10,
        max: 40
      }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
      <h2>Températures sur 24h</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TemperatureChart;
