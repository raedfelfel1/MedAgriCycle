import { useState, useEffect } from 'react';

const convertTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return (celsius * 9) / 5 + 32;
  } else if (unit === 'kelvin') {
    return celsius + 273.15;
  }
  // Par défaut celsius
  return celsius;
};

export const useTemperatureUnit = (initialCelsius) => {
  const [temperatureC, setTemperatureC] = useState(initialCelsius);
  const [unit, setUnit] = useState(localStorage.getItem('tempUnit') || 'celsius');
  const [temperature, setTemperature] = useState(() => convertTemperature(initialCelsius, unit));

  useEffect(() => {
    setTemperature(convertTemperature(temperatureC, unit));
  }, [temperatureC, unit]);

  useEffect(() => {
    const onStorageChange = () => {
      const newUnit = localStorage.getItem('tempUnit') || 'celsius';
      setUnit(newUnit);
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return {
    temperature,
    setTemperatureC,
    unit,
  };
};
