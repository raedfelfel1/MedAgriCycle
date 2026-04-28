import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";

import { fetchSensorHistory,fetchLiveInit } from "../../services/api";
import { useData } from "../../app/dataContext"

const screenWidth = Dimensions.get("window").width;

export default function ConductivityChart({ sensors, hours }) {
  const { t } = useTranslation();
  const { getChartData } = useData();
  const [currentData, setCurrentData] = useState();
  const [liveData, setLiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const MAX_POINTS = 8;
  //  MODE LIVE : Tick toutes les 2 sec et fenetre glissante
 useEffect(() => {
  console.log("ConductivityChart")
  if (!sensors?.length) return;

  const sensorId = sensors[0]._id;
  let isMounted = true;
  let interval;

  const load = async () => {
    // --------------------- MODE LIVE ---------------------
    if (hours === "live") {
      setIsLoading(true);
      try {
        // Charger les 5 dernières valeurs d’un coup
        const init = await fetchLiveInit(sensorId);
        console.log("init :", init);
        if (!isMounted) return;

        setLiveData(
          init.map(row => ({
            timestamp: new Date(row.timestamp),
            conductivity: row.conductivity ?? 0,
          }))
        );
      } catch (err) {
        console.error("Erreur lors de l'initialisation LIVE :", err);
      } finally {
        setIsLoading(false);
      }

      // Tick toutes les 2 sec → récupérer UNIQUEMENT le dernier relevé
      const tick = async () => {
        try {
          const raw = await fetchSensorHistory(sensorId,hours);
          if (!isMounted || !raw) return;
          const row = raw[raw.length - 1];

          console.log("ROW :", row);

          const newPoint = {
            timestamp: new Date(row.timestamp),
            conductivity: row.conductivity ?? 0,
          };
          setLiveData(prev => {
            const updated = [...prev, newPoint];

            // Limiter la fenêtre glissante à MAX_POINTS points
            if (updated.length > MAX_POINTS) updated.shift();

            return updated;
          });
        } catch (err) {
          console.error("Erreur LIVE tick:", err);
        }
      };

      interval = setInterval(tick, 2000);
      return;
    }


    // --------------------- MODE HISTORIQUE ---------------------
    setIsLoading(true);

    try {
      const data = await getChartData(sensorId, hours);
      setCurrentData(data);
      if (!isMounted) return;

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  load();

  return () => {
    isMounted = false;
    if (interval) clearInterval(interval);
  };
}, [hours, sensors]);



  //  Sélection des données : LIVE ou HISTORIQUE
  const data = hours === "live" ? liveData : currentData;

  // ⛔ Si live → attendre au moins 1 point
  if (hours === "live" && liveData.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
        <Text>Initialisation du LIVE...</Text>
      </View>
    );
  }

  // ⛔ Si historique → attendre que cache soit rempli
  if (hours !== "live" && !currentData) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="red" />
        <Text>{t("loading")}</Text>
      </View>
    );
  }



  //  Labels
  const labels = hours === "live"
    ? data.map((_, i) => {
        const sec = i * 2;
        return sec % 15 === 0 ? `${sec}s` : "";
      })
    : (() => {
        if (hours <= 72) {
          const wantedHours = [0, 6, 12, 18];
          return data.map((d) => {
            const h = d.timestamp.getHours();
            return wantedHours.includes(h) ? `${h}h` : "";
          });
        }

        if (hours === 168) {
          const interval = 2;
          return data.map((d, i) =>
            i % interval === 0
              ? d.timestamp.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
              : ""
          );
        }

        if (hours === 720) {
          const interval = 7;
          return data.map((d, i) =>
            i % interval === 0
              ? d.timestamp.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })
              : ""
          );
        }

        return data.map(() => "");
      })();

  
  
      //  Données pour LineChart
  const chartData = {
    labels,
    datasets: [
      {
        data: data.map(d => d.conductivity),
        color: () => "#E040FB",
        strokeWidth: 2,
      },
    ],
    legend: [hours === "live" ? "Conductivity (Live)" : t("ph") + "%"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {hours === "live" ? "Conductivity - LIVE" : ""+t("ph")+" ("+hours+"h)"}
      </Text>

      <LineChart
        data={chartData}
        width={screenWidth - 24}
        height={260}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f9f9f9",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 12 },
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#E040FB",
          },
        }}
        bezier
        style={styles.chart}
        fromZero
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
