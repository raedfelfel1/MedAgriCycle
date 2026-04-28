import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { fetchSensorsByProduct,fetchSensorHistory } from "../../services/api";
import { useData } from "../../app/dataContext"

const summarizeRec = (rec,t) => {
  const {
    productName,
    temperature,
    humidity,
    ph,
    minTemp,
    maxTemp,
    minHumidity,
    maxHumidity,
    minPh,
    maxPh,
  } = rec;

  let issues = [];
  if (minTemp != null && maxTemp != null && temperature!=null) {
    if (temperature < minTemp) issues.push(t("tempTooLow"));
    else if (temperature > maxTemp) issues.push(t("tempTooHigh"));
  }

  if (minHumidity != null && maxHumidity != null && humidity!=null) {
    if (humidity < minHumidity) issues.push(t("humidityTooLow"));
    else if (humidity > maxHumidity) issues.push(t("humidityTooHigh"));
  }

  if (minPh != null && maxPh != null && ph!=null) {
    if (ph < minPh) issues.push(t("phTooLow"));
    else if (ph > maxPh) issues.push(t("phTooHigh"));
  }

  if (issues.length === 0) {
    return (
      <View style={styles.optimalRow}>
        <Text style={styles.optimalText}>{productName} : {t("normalConditions")}</Text>
        <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
      </View>
    );
  }

  return `${productName} : ${issues.join(", ")}`;
};

export default function TopRightSection() {
  const [recommandations, setRecommendations] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedFarmId, products } = useData();

  useEffect(() => {
    console.log("topRightsection")
    if (!selectedFarmId || !products?.length) return;

    const loadData = async () => {
      try {
        
        const farmProducts = products.filter(
          p => String(p.farm) === String(selectedFarmId)
        );

        
        const results = await Promise.all(
          farmProducts.map(async (product) => {
            try {
              // capteurs du produit
              const sensors = await fetchSensorsByProduct(product._id);

              if (!sensors || sensors.length === 0) return null;

              // dernier relevé (live)
              const liveData = await fetchSensorHistory(sensors[0]._id, "live");
              console.log("LIVE data : ",liveData)
              if (!liveData) return null;

              return {
                productId: product._id,
                productName: product.name,
                temperature: liveData.temperature ?? null,
                humidity: liveData.humidity ?? null,
                ph: liveData.ph ?? null,

                minTemp: product.minTemperature,
                maxTemp: product.maxTemperature,
                minHumidity: product.minHumidite,
                maxHumidity: product.maxHumidite,
                minPh: product.minPh,
                maxPh: product.maxPh,
              };
            } catch (err) {
              console.warn("Erreur produit", product.name, err);
              return null;
            }
          })
        );

        
        setRecommendations(results.filter(Boolean));
      } catch (err) {
        console.error("Erreur chargement recommandations live", err);
      }
    };

    loadData();
  }, [selectedFarmId, products]);
  
const summaryList = recommandations.map((rec) => summarizeRec(rec, t));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("recommandations")}</Text>

      {summaryList.length === 0 ? (
        <Text>{t("noRecommandation")}</Text>
      ) : (
        <FlatList
          data={summaryList}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) =>
            typeof item === "string" ? (
              <Text style={styles.listItem}>{item}</Text>
            ) : (
              item
            )
          }
          scrollEnabled={false}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/recommandation")}
      >
        <Text style={styles.buttonText}>{t("seeRecommandation")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  optimalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  optimalText: {
    fontSize: 14,
    color: "#4CAF50",
    marginRight: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
