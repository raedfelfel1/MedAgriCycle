import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function convertTemperature(celsius, unit){
  if (unit === "fahrenheit") {
    return (celsius * 9) / 5 + 32;
  } else if (unit === "kelvin") {
    return celsius + 273.15;
  }
  return celsius; // défaut: Celsius
};

export const useTemperatureUnit = (initialCelsius) => {
  const [temperatureC, setTemperatureC] = useState(initialCelsius);
  const [unit, setUnit] = useState("celsius");
  const [temperature, setTemperature] = useState(() =>convertTemperature(initialCelsius, unit)
  );


  // Charger la préférence stockée
  useEffect(() => {
    const loadUnit = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem("tempUnit");
        if (savedUnit) {
          setUnit(savedUnit);
        }
      } catch (err) {
        console.error("Erreur lecture unité température :", err);
      }
    };
    loadUnit();
  }, []);

  // Met à jour la valeur convertie
  useEffect(() => {
    setTemperature(convertTemperature(temperatureC, unit));
  }, [temperatureC, unit]);

  // Sauvegarder l’unité quand elle change
  const changeUnit = async (newUnit) => {
    try {
      setUnit(newUnit);
      await AsyncStorage.setItem("tempUnit", newUnit);
    } catch (err) {
      console.error("Erreur sauvegarde unité :", err);
    }
  };

  return {
    temperature,     
    setTemperatureC, 
    unit,            
    changeUnit,      
  };
};
