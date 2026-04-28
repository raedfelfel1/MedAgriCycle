import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import {fetchSensorHistory} from '../../services/api';
import Sensor from '../sensors/Sensor';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);


const CombinedChart = ({sensorId,hour,time}) => {
  const [data, setData] = useState([]);
  const[isLoading,setIsLoading]=useState(true);
  const loadData = async () => {
      try {
        const newData = await fetchSensorHistory(sensorId,hour); // on utilise la version avec paramètre
        if(hour=="live"){
          setData((prev)=>(
            [...prev,...newData]
          ));
        }
        else{
          setData([...newData].reverse()); // du plus ancien au plus récent
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error.message);
      } finally {
        setIsLoading(false);
      }
  };
  useEffect(()=>{
    if(!sensorId) return
        loadData();
  },[sensorId]);
  useEffect(()=>{
      let interval;
      if(hour=="live"){
        console.log("live mode init")
        interval = setInterval(()=>{
          loadData()
        },time)
      }
      return () => clearInterval(interval);
  },[])

  const chartData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Température (°C)',
        data: data.map(d => d.temperature),
        borderColor: '#f87171',
        backgroundColor: '#f87171',
        yAxisID: 'y1'
      },
      {
        label: 'Humidité (%)',
        data: data.map(d => d.humidity*100),
        borderColor: '#60a5fa',
        backgroundColor: '#60a5fa',
        yAxisID: 'y2'
      },
      {
        label: 'pH',
        data: data.map(d => d.ph),
        borderColor: '#34d399',
        backgroundColor: '#34d399',
        yAxisID: 'y3'
      },
      {
        label: 'conductivity',
        data: data.map(d => d.conductivity),
        borderColor: "#fc08c7",
        backgroundColor: "#fc08c7",
        yAxisID: 'y4'
      },
    ]
  };

  const options = {
    scales: {
      x: { type: 'time', time: { unit: 'hour' } },
      y1: { type: 'linear', position: 'left', title: { display: true, text: 'Température (°C)' },
      min:Math.round(Math.min(...data.map((value)=>(value.temperature)))-5),
      max:Math.round(Math.max(...data.map((value)=>(value.temperature)))+5),
      },
      y2: { type: 'linear', position: 'left', title: { display: true, text: 'Humidité (%)' }, grid: { drawOnChartArea: false },
      min:Math.round(Math.min(...data.map((value)=>(value.humidity)))*100-10),
      max:Math.round(Math.max(...data.map((value)=>(value.humidity)))*100+10),
      },
      y3: { type: 'linear', position: 'right', title: { display: true, text: 'pH' }, grid: { drawOnChartArea: false },
      min:Math.round(Math.min(...data.map((value)=>(value.ph)))-1),
      max:Math.round(Math.max(...data.map((value)=>(value.ph)))+1),
      },
      y4: { type: 'linear', position: 'right',  title: { display: true, text: 'conductivity' }, grid: { drawOnChartArea: false },
      min:Math.round(Math.min(...data.map((value)=>(value.conductivity)))-5),
      max:Math.round(Math.max(...data.map((value)=>(value.conductivity)))+5),
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: 'auto' }}>
      <h2>Graphique combiné</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};
export default CombinedChart;
