import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { fetchSensorHistory } from '../../services/api';

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);

const AdvancementChart = ({sensorId,type,hour,time}) => {
  const [valueData, setValueData] = useState([]);
  const [chart,setChart]=useState(<></>)
  const [isLoading, setIsLoading] = useState(true);
  const loadData = async () => {
    try {
      const data = await fetchSensorHistory(sensorId,hour); // on utilise la version avec paramètre
      if(hour=="live"){
        setValueData((prev)=>(
          [...prev,...data.reverse()]
        ));
      }
      else{
        setValueData([...data].reverse()); // du plus ancien au plus récent
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(!sensorId) return
    loadData();
  }, [sensorId]);
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
  useEffect(()=>{
    let title;
    let label;
    let color;
    switch (type) {
      case "temperature":
          title="Température"
          color='#f87171'
          label=title+' (°C)'
        break;
      case "humidity":
          title="Humidité"
          color='#60a5fa'
          label=title+' (%)'
        break;
      case "Ph":
          title="Ph" // if you want to change label, color and title of the chart
          color='#34d399'
          label=title+""
        break;
      case "conductivity":
          title="Conductivité"
          color="#fc08c7"
          label=title+""
        break;
      default:
          title=""
          label=title+""
        break;
    }
    const chartData = {
      labels: valueData.map(d => new Date(d.timestamp)),
      datasets: [
        {
          label: label,
          data: valueData.map(d => {
            switch (type.toLowerCase()) {
              case "temperature":
                return d.temperature;
              case "humidity":
                return d.humidity * 100;
              case "ph":
                return d.ph;
              case "conductivity":
                return d.conductivity;
                default:
                  return null;
            }
          }),
          fill: false,
          borderColor: color,
          backgroundColor: color,
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
          text: label,
        },
        // automatic management of extremum
        min:
        type.toLowerCase()=="ph"?Math.round(Math.min(...valueData.map((value)=>(value.ph)))-1)
        :type.toLowerCase()=="humidity"?Math.round(Math.min(...valueData.map((value)=>(value.humidity)))*100-10)
        :type.toLowerCase()=="temperature"?Math.round(Math.min(...valueData.map((value)=>(value.temperature)))-5)
        :type.toLowerCase()=="conductivity"?Math.round(Math.min(...valueData.map((value)=>(value.conductivity)))-5)
        :100,
        max: 
        type.toLowerCase()=="ph"?Math.round(Math.max(...valueData.map((value)=>(value.ph)))+1)
        :type.toLowerCase()=="humidity"?Math.round(Math.max(...valueData.map((value)=>(value.humidity)))*100+10)
        :type.toLowerCase()=="temperature"?Math.round(Math.max(...valueData.map((value)=>(value.temperature)))+5)
        :type.toLowerCase()=="conductivity"?Math.round(Math.max(...valueData.map((value)=>(value.conductivity)))+5)
        :100
      }
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    }
  };
    setChart(<>
    <div style={{ width: '100%', maxWidth: 800, margin: 'auto' }}>
      <h2>{title?title:"Not found"}</h2>
      <Line data={chartData} options={options} />
    </div>
    </>)
  },[valueData]) 
  return (
    <>
      {chart}
    </>
  );
};

export default AdvancementChart;
