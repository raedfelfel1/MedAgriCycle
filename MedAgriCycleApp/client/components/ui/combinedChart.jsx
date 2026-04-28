import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";

import { fetchSensorHistory } from "../../services/api";

const screenWidth = Dimensions.get("window").width;

export default function CombinedChart({ sensors,hours }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log("combinedChart")
      try {
        if (!sensors) return;

        // On suppose qu’il y a un capteur par type
        const tempSensor = sensors.find(s => s.type === "temperature");
        const humSensor = sensors.find(s => s.type === "temperature"); // A MODIF 
        const phSensor = sensors.find(s => s.type === "temperature");
        console.log("temp : ",tempSensor)
        console.log("")
        console.log("humidité : ",humSensor)
        console.log("")
        console.log("ph : ",phSensor)
        if (!tempSensor && !humSensor && !phSensor) {
          console.warn("Aucun capteur trouvé pour ce produit");
          setData([]);
          return;
        }

        // 2️⃣ Récupérer les historiques
        const [tempData, humData, phData] = await Promise.all([
          tempSensor ? fetchSensorHistory(tempSensor._id,hours) : Promise.resolve([]),
          humSensor ? fetchSensorHistory(humSensor._id,hours) : Promise.resolve([]),
          phSensor ? fetchSensorHistory(phSensor._id,hours) : Promise.resolve([]),
        ]);
      
        // Fusionner par timestamp
        const merged = [];
        const byTimestamp = {};

        const addToMap = (arr, key) => {
          arr.forEach(d => {
            const ts = new Date(d.timestamp).toISOString();
            if (!byTimestamp[ts]) byTimestamp[ts] = { timestamp: new Date(d.timestamp) };
            byTimestamp[ts][key] = d[key];
          });
        };

        addToMap(tempData, "temperature");
        addToMap(humData, "humidity");
        addToMap(phData, "ph");

        Object.values(byTimestamp)
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .forEach(d => merged.push(d));

        setData(merged);
      } catch (error) {
        console.error("Erreur lors du chargement des données combinées :", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [sensors,hours]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.center}>
        <Text>Aucune donnée disponible</Text>
      </View>
    );
  }

  // Labels toutes les 3h environ
  const labels = data.map((d, i) =>
    i % 3 === 0 ? d.timestamp.getHours() + "h" : ""
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: data.map(d => d.temperature ?? 0),
        color: () => "#f87171", // rouge
        strokeWidth: 2,
      },
      {
        data: data.map(d => d.humidity ?? 0),
        color: () => "#60a5fa", // bleu
        strokeWidth: 2,
      },
      {
        data: data.map(d => d.ph ?? 0),
        color: () => "#34d399", // vert
        strokeWidth: 2,
      },
    ],
    legend: [t("temp")+" (°C)", t("humidity")+" (%)", "pH"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("combinedGraph")}</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 24}
        height={280}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f9f9f9",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 12 },
          propsForDots: {
            r: "2",
            strokeWidth: "1",
            stroke: "#fff",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16, alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  chart: { borderRadius: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
