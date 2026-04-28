import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { fetchProductsByTank, fetchTankHistoryByTankAndProduct } from "../../services/api";
import TankPieChart from "./tankPieChart";

export default function TankDetailChart({ tankId }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    console.log("tankDetailChart")
    const loadConsumption = async () => {
      try {
        setIsLoading(true);

        const tankProducts = await fetchProductsByTank(tankId);

        const results = [];

        for (const product of tankProducts) {
          const history = await fetchTankHistoryByTankAndProduct(tankId, product._id);

          const total = history.reduce((sum, entry) => sum + (entry.quantity ?? 0), 0);

          results.push({
            name: product.name,
            value: total,
            product,
          });
        }

        // Total pourcentage
        const globalTotal = results.reduce((acc, r) => acc + r.value, 0);

        const coloredResults = results.map((r) => ({
          ...r,
          color: generateRandomColor(),
          percentage: globalTotal > 0 ? ((r.value / globalTotal) * 100).toFixed(1) : 0,
        }));

        setChartData(coloredResults);

      } catch (error) {
        console.log("Erreur consommation tank :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConsumption();
  }, [tankId]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* PIE CHART */}
      <Text style={styles.title}>Distribution of consumption</Text>
      <View style={{ alignItems: "center" }}>
        <TankPieChart data={chartData} />
      </View>

      {/* LISTE PRODUITS */}
      <Text style={styles.subtitle}>Linked products</Text>

      {chartData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.productCard}
          onPress={() => router.push({
            pathname: "/(tabs)/tanksManagementFolder/productDetail",
            params: { 
              productId: item.product._id,
              tankId:tankId
             }
          })}
        >
          {/* Couleur du produit identique au pie chart */}
          <View style={{ width: 20, height: 20, backgroundColor: item.color, borderRadius: 4 }} />

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.productName}>{item.name}</Text>
          </View>

          <Text style={styles.usage}>
            {item.value} L ({item.percentage}%)
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0")}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  productCard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  productName: { fontSize: 16, fontWeight: "600" },
  usage: { fontSize: 16, fontWeight: "bold", color: "#444" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
