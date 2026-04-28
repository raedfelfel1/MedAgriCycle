import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from "react-native";
import { t } from "i18next";

import HistoriqueDownload from "./historiqueDownload";
import TemperatureChart from "./temperatureChart";
import HumidityChart from "./humidityChart";
import PhChart from "./phChart";

import { fetchSensorsByProduct } from "../../services/api";
import ConductivityChart from "./conductivityChart";

export default function ProductDashboard({productId}) {
  const [showHistory, setShowHistory] = useState(false);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoursRange, setHoursRange] = useState(24)

  useEffect(() => {
    let isMounted = true;
    const loadSensors = async () => {
      try {
        const data = await fetchSensorsByProduct(productId);
        if (isMounted) setSensors(data);
      } catch (err) {
        console.error("Erreur capteurs :", err);
        setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSensors();
    return () => { isMounted = false };
  }, [productId]);

  if (!productId) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{t("noProductSelected")}</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" color="green" />;
  if (error) return <Text>Erreur : {error}</Text>;

  return (
      <View style={styles.container}>
        <View style={[styles.content, showHistory && styles.fullWidth]}>
          {showHistory ? (
            <HistoriqueDownload onBack={() => setShowHistory(false)} />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>

              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.historyButton}
                  onPress={() => setShowHistory(true)}
                >
                  <Text style={styles.historyText}>{t("viewHistory")}</Text>
                </TouchableOpacity>
                <View style={styles.rangeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.rangeButton,
                      hoursRange === 24 && styles.rangeButtonActive
                    ]}
                    onPress={() => setHoursRange(24)}
                  >
                    <Text style={hoursRange === 24 ? styles.rangeTextActive : styles.rangeText}>
                      24h
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.rangeButton,
                      hoursRange === 48 && styles.rangeButtonActive
                    ]}
                    onPress={() => setHoursRange(48)}
                  >
                    <Text style={hoursRange === 48 ? styles.rangeTextActive : styles.rangeText}>
                      48h
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.rangeButton,
                      hoursRange === 168 && styles.rangeButtonActive
                    ]}
                    onPress={() => setHoursRange(168)}
                  >
                    <Text style={hoursRange === 168 ? styles.rangeTextActive : styles.rangeText}>
                      7j
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.rangeButton,
                      hoursRange === 720 && styles.rangeButtonActive
                    ]}
                    onPress={() => setHoursRange(720)}
                  >
                    <Text style={hoursRange === 720 ? styles.rangeTextActive : styles.rangeText}>
                      1m
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.rangeButton,
                      hoursRange === "live" && styles.rangeButtonActive
                    ]}
                    onPress={() => setHoursRange("live")}
                  >
                    <Text style={hoursRange === "live" ? styles.rangeTextActive : styles.rangeText}>
                      live
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
  
              {/* Graphiques */}
              <View style={styles.chartsGrid}>
                <View style={styles.chartCard}>
                  <TemperatureChart sensors={sensors} hours={hoursRange}/>
                </View>
                <View style={styles.chartCard}>
                  <HumidityChart sensors={sensors} hours={hoursRange}/>
                </View>
                <View style={styles.chartCard}>
                  <PhChart sensors={sensors} hours={hoursRange}/>
                </View>
                <View style={styles.chartCard}>
                  <ConductivityChart sensors={sensors} hours={hoursRange}/>
                </View>
                
  
                
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    content: { flex: 1},
    fullWidth: { flex: 1, marginLeft: 0 },
    header: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    title: { fontSize: 20, fontWeight: "bold" },
    historyButton: {
      backgroundColor: "#78d37d",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginTop: 8,
    },
    historyText: { color: "white", fontWeight: "600" },
    scrollContent: { paddingBottom: 30 },
    chartsGrid: { flexDirection: "column", gap: 16 },
    chartCard: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: "white",
      elevation: 3,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      textAlign: "center",
    },
    fullChart: {},
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 16, marginTop: 8 },
    rangeSelector: {
  flexDirection: "row",
  marginTop: 10,
  gap: 10,
},

rangeButton: {
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#78d37d",
},

rangeButtonActive: {
  backgroundColor: "#78d37d",
},

rangeText: {
  color: "#78d37d",
  fontWeight: "600",
},

rangeTextActive: {
  color: "white",
  fontWeight: "700",
},
  });

