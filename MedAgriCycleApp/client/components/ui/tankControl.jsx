import { useEffect, useState,useRef,useCallback } from "react";
import { View,Text,StyleSheet,ScrollView,TouchableOpacity,ActivityIndicator,Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Slider from "@react-native-community/slider";

import { fetchTankHistoryByTankAndProduct, fetchTankById} from "../../services/api";
import { useData } from "../../app/dataContext"

export default function TankControl({ tankId, tankLevel, tankType, productId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [irrigationAmount, setIrrigationAmount] = useState(10);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [error, setError] = useState(null);
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [tankName, setTankName] = useState("");
  const timeoutRef = useRef(null);
  const isActiveRef = useRef(true);
  const {createTankHistory} = useData(); // A UTILISER

  
  const tankColor = tankType === "water" ? "dodgerblue" : "#4CAF50";
  const actionLabel = tankType === "water" ? t("irrigate") : t("fertilize");
  const actionType = tankType === "water" ? "irrigate" : "fertilize";

  useEffect(() => {
    const loadTankData = async () => {
      try {
        console.log("tankControl")
        if (!tankId || !productId) {
          setError(t("noTankLinked"));
          setLoading(false);
          return;
        }

        // Récupérer la capacité et le nom du tank
        const tankData = await fetchTankById(tankId);
        setMaxCapacity(tankData.capacity || 100);
        setTankName(tankData.name);

        // charger l’historique filtré
        const data = await fetchTankHistoryByTankAndProduct(tankId, productId);
        if (!data || data.length === 0) {
          setHistory([]);
          setCurrentLevel(0);
        } else {
          console.log("current level : ",tankLevel)
          setHistory(data);
          setCurrentLevel(tankLevel ?? 0);
        }
      } catch (err) {
        console.error("Erreur chargement données tank :", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    loadTankData();
  }, [tankId, productId]);

  useFocusEffect(
  useCallback(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
      clearTimeout(timeoutRef.current);
    };
  }, [])
);

  // irrigation ou fertilisation
  const handleAction = async () => {
    if (currentLevel - irrigationAmount < 0) {
      Alert.alert(t("error"), t("notEnoughWater"));
      return;
    }

    setIsIrrigating(true);
    try {
      const newLevel = Math.max(currentLevel - irrigationAmount, 0);

      timeoutRef.current = setTimeout(async () => {
        
        const newHistoryItem = {
          quantity: irrigationAmount,
          newLevel,
          action: actionType,
          timestamp: new Date().toISOString(),
        };

        setHistory([newHistoryItem, ...history]);
        if (!isActiveRef.current) return;
        setCurrentLevel(newLevel);
        setIsIrrigating(false);

        //create par le dataContext
        createTankHistory(tankId, productId, irrigationAmount, newLevel,actionType);
        console.log("✅ Historique sauvegardé !");
      }, 1500);
    } catch (err) {
      console.error("❌ Erreur lors de l’action :", err);
      Alert.alert(t("error"), t("saveError"));
      setIsIrrigating(false);
    }
  };

  const handleRefill = () => {
    setCurrentLevel(maxCapacity);
    Alert.alert(t("tank"), t("tankReset"));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={tankColor} />
        <Text>{t("loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 En-tête */}
      <View style={styles.header}>
        <MaterialIcons
          name={tankType === "water" ? "water-drop" : "science"}
          size={32}
          color={tankColor}
        />
        <Text style={styles.title}>
          {tankType === "water"
            ? t("waterTankMonitoring")
            : t("fertilizerTankMonitoring")}
        </Text>
      </View>

      {/* 🔹 Niveau actuel */}
      <View style={styles.panel}>
        <Text style={styles.subtitle}>{tankName}</Text>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barFill,
              {
                width: `${(currentLevel / maxCapacity) * 100}%`,
                backgroundColor: tankColor,
              },
            ]}
          />
        </View>
        <Text style={styles.barLabel}>
          {currentLevel}L / {maxCapacity}L
        </Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: tankColor }]} onPress={handleRefill}>
          <MaterialIcons name="autorenew" size={20} color="white" />
          <Text style={styles.buttonText}>{t("fillTank")}</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Slider et action */}
      <View style={styles.panel}>
        <Text style={styles.sliderLabel}>
          {t("quantity")} : {irrigationAmount} L
        </Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={maxCapacity}
          step={1}
          value={irrigationAmount}
          onValueChange={setIrrigationAmount}
          minimumTrackTintColor={tankColor}
          maximumTrackTintColor="#ddd"
          thumbTintColor={tankColor}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isIrrigating ? "gray" : tankColor }, // ✅ couleur selon le type
          ]}
          onPress={handleAction}
          disabled={isIrrigating}
        >
          <MaterialIcons
            name={tankType === "water" ? "water-drop" : "local-florist"}
            size={20}
            color="white"
          />
          <Text style={styles.buttonText}>
            {isIrrigating
              ? t("actionInProgress")
              : `${actionLabel} ${irrigationAmount}L`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Historique */}
      <View style={styles.panel}>
        <Text style={styles.subtitle}>{t("consumptionHistory")}</Text>
        {history.length === 0 ? (
          <Text>{t("noConsumptionHistory")}</Text>
        ) : (
          history.map((item, idx) => (
            <View key={idx} style={styles.historyItem}>
              <Text style={[styles.historyText, { color: tankColor }]}>
                {t(item.action)}
              </Text>
              <Text style={styles.historyText}>
                {t("used")}: {item.quantity} L
              </Text>
              <Text style={styles.historyText}>
                {t("remaining")}: {item.newLevel} L
              </Text>
              <Text style={styles.dateText}>
                {new Date(item.timestamp).toLocaleDateString()}{" "}
                {new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  barContainer: {
    height: 16,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  barLabel: { textAlign: "center", marginTop: 6, fontWeight: "600" },
  sliderLabel: { fontSize: 16, fontWeight: "500", marginBottom: 8 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: { color: "white", marginLeft: 8 },
  historyItem: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  historyText: { fontSize: 14 },
  dateText: { fontSize: 12, color: "#777" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "red", textAlign: "center", fontSize: 16 },
});
