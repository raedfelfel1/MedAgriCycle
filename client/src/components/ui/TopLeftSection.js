import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../../contexts/styles/TopLeftSection.css';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { useTemperatureUnit } from '../../contexts/hooks/useTemperatureUnit';

// const socket = io('');

const TopLeftSection = () => {
  const { temperature, setTemperatureC, unit } = useTemperatureUnit(0);
  const [humidity, setHumidity] = useState(0);
  const [ph, setPh] = useState(7.0);

  const [temperatureIconColor, setTemperatureIconColor] = useState("success");
  const [humidityIconColor, setHumidityIconColor] = useState("success");

  // useEffect(() => {
  //   socket.on('sensorData', (data) => {
  //     setTemperatureC(data.temperature);  // on stocke la température en Celsius dans le hook
  //     setHumidity(data.humidity);
  //     setPh(data.ph);

  //     // Ajuste les couleurs selon la température en Celsius d'origine
  //     setTemperatureIconColor(
  //       data.temperature > 32 ? "error" : data.temperature < 18 ? "primary" : "success"
  //     );

  //     setHumidityIconColor(
  //       data.humidity > 80 ? "warning" : data.humidity < 40 ? "primary" : "success"
  //     );
  //   });

  //   return () => {
  //     socket.off('sensorData');
  //   };
  // }, [setTemperatureC]);

  // Préparer l’affichage avec unité
  const unitSymbol = unit === 'fahrenheit' ? '°F' : unit === 'kelvin' ? 'K' : '°C';

  return (
    <>
      <div className="top-left-container">
        <div className="temperature-humidite">
          <div className="temperature">
            <DeviceThermostatIcon color={temperatureIconColor} /> Température : {temperature.toFixed(2)}{unitSymbol}
          </div>
          <div className="humidite">
            <OpacityIcon color={humidityIconColor} /> Humidité : {humidity}%
          </div>
        </div>
        <div className="ph-moisture">
          <div className="ph">
            <Stack sx={{ height: 55 }} spacing={1} direction="row">
              <Slider
                aria-label="ph"
                value={ph}
                getAriaValueText={() => `${ph}`}
                color="secondary"
                min={6}
                max={9}
                step={0.1}
                size="small"
                orientation="vertical"
                disabled
              />
            </Stack>
            pH : {ph}
          </div>
          <div className="moisture">
            Qualité
          </div>
        </div>
      </div>
      <div className="vertical-divider"></div>
    </>
  );
};

export default TopLeftSection;
