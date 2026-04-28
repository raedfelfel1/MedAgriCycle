import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import {fetchSensorHistory} from '../../services/api';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);


const PhChart = (farmId) => {
  const [phData, setPhData] = useState([]);
  const[isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    const loadData = async () => {
          try {
            const data = await fetchSensorHistory(farmId,24); // on utilise la version avec paramètre
            setPhData(data.reverse()); // du plus ancien au plus récent
          } catch (error) {
            console.error('Erreur lors du chargement des données :', error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        loadData();
  },[]);


  const chartData = {
    labels: phData.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'pH',
        data: phData.map(d => d.ph),
        fill: false,
        borderColor: '#34d399',
        backgroundColor: '#34d399',
        tension: 0.3,
        pointRadius: 2,
      }
    ]
  };

  const options = {
    scales: {
      x: { type: 'time', time: { unit: 'hour' } },
      y: { title: { display: true, text: 'pH' }, min:0 , max: 14    
   }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
      <h2>Évolution du pH</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};
export default PhChart;

