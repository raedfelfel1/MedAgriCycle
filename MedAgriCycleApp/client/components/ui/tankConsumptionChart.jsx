import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";

import { fetchTankHistoryByTankAndProduct } from "../../services/api";

const screenWidth = Dimensions.get("window").width;

function fillMissing(data, hoursMode) {
  if (!data.length) return data;

  // Tri obligatoire
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);

  const filled = [];
  const start = sorted[0].timestamp;
  const end = sorted[sorted.length - 1].timestamp;

  const step = hoursMode ? 3600 * 1000 : 24 * 3600 * 1000; // heure / jour

  let cursor = new Date(start);

  while (cursor <= end) {
    const existing = sorted.find(
      d => Math.abs(d.timestamp - cursor) < step / 2
    );

    if (existing) {
      filled.push(existing);
    } else {
      filled.push({
        timestamp: new Date(cursor),
        consumption: 0,
      });
    }

    cursor = new Date(cursor.getTime() + step);
  }

  return filled;
}

function groupByHour(data) {
  const groups = {};

  data.forEach(entry => {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();

    // fenêtre ±30 min → si minutes > 30 → groupe+1
    const normalizedHour = date.getMinutes() > 30 ? hour + 1 : hour;

    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${normalizedHour}`;

    if (!groups[key]) groups[key] = 0;
    groups[key] += entry.consumption;
  });

  return Object.entries(groups).map(([key, value]) => {
    const [y, m, d, h] = key.split("-");
    return { timestamp: new Date(y, m, d, h), consumption: value };
  });
}

// 🔧 Regroupe les consommations par jour
function groupByDay(data) {
  const groups = {};

  data.forEach(entry => {
    const date = new Date(entry.timestamp);
    const key = date.toISOString().split("T")[0]; // yyyy-mm-dd

    if (!groups[key]) groups[key] = 0;
    groups[key] += entry.consumption;
  });

  return Object.entries(groups).map(([key, value]) => ({
    timestamp: new Date(key),
    consumption: value
  }));
}

export default function TankConsumptionChart({ productId, hours,tankId }) {
  const { t } = useTranslation();

  const [cache, setCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("tanksConsumptionChart")
    if (!productId) return;

    const load = async () => {
      if (cache[hours]) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        console.log("variables : ",productId,tankId)
        const rawData = await fetchTankHistoryByTankAndProduct(tankId,productId);
        let i=0;
        
        const sorted = rawData.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        const processed = sorted.map(d => ({
            timestamp: new Date(d.timestamp),
            consumption:
                typeof d.quantity === "number"? d.quantity : 0,
        }));

        let grouped;

        if (hours <= 72) {
          grouped = groupByHour(processed);
          grouped = fillMissing(grouped, true);   // ➜ complète les heures manquantes
        } else {
          grouped = groupByDay(processed);
          grouped = fillMissing(grouped, false);  // ➜ complète les jours manquants
        }

        setCache(prev => ({ ...prev, [hours]: grouped }));
      } catch (e) {
        console.error("Erreur fetch conso:", e);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [hours, productId]);

  const data = cache[hours];
  if (!data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  const newest = data[data.length - 1].timestamp.getTime();
  const filteredData = data.filter(d => 
    newest - d.timestamp.getTime() <= hours * 3600 * 1000
  );

  // 🔍 Labels
  const labels = (() => {
  if (hours <= 72) {
    const wantedHours = [0, 6, 12, 18];
    return filteredData.map((d) => {
      const h = d.timestamp.getHours();
      return wantedHours.includes(h) ? `${h}h` : "";
    });
  }

  if (hours === 168) {
    // --- 7 jours → un label tous les 2 jours ---
    const interval = 2; 
    return filteredData.map((d, i) =>
      i % interval === 0
        ? d.timestamp.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })
        : ""
    );
  }

  if (hours === 720) {
    // --- 30 jours → un label tous les 5 jours ---
    const interval = 7;
    return filteredData.map((d, i) =>
      i % interval === 0
        ? d.timestamp.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })
        : ""
    );
  }

  return filteredData.map(() => "");
})();

  const chartData = {
    labels,
    datasets: [
      {
        data: filteredData.map(d => d.consumption),
        color: () => "#6366f1", // Indigo
        strokeWidth: 2,
      },
    ],
    legend: [t("Consommation du produit Ail") + " (L)"],
  };
  console.log("filterdd data : ",filteredData)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Évolution de la consommation</Text>

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
            stroke: "#6366f1",
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
