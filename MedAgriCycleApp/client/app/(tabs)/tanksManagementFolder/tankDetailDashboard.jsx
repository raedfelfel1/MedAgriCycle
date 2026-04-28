import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import Barside from "../../../components/ui/barside.jsx";
import TankDetail from "../../../components/ui/tankDetails.jsx"; 
import TankDetailChart from "../../../components/ui/tankDetailChart.jsx"; 

export default function TankDetailDashboard() {
  const { t } = useTranslation();

  const { tankId, tankType } = useLocalSearchParams();
  

  const [activeTab, setActiveTab] = useState("details"); // "details" | "graph"

  return (
    <View style={styles.barside}>

      <View style={styles.container}>

        {/* 🔹 Barre d’onglets (comme TankDashboard) */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "details" && styles.tabButtonActive]}
            onPress={() => setActiveTab("details")}
          >
            <Text style={[styles.tabText, activeTab === "details" && styles.tabTextActive]}>
              {t("details")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "graph" && styles.tabButtonActive]}
            onPress={() => setActiveTab("graph")}
          >
            <Text style={[styles.tabText, activeTab === "graph" && styles.tabTextActive]}>
              {t("graphs")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Contenu */}
        <ScrollView style={styles.content}>
          {activeTab === "details" ? (
            <TankDetail tankId={tankId} tankType={tankType} />
          ) : (
            <TankDetailChart tankId={tankId}/>
          )}
        </ScrollView>
      </View>

      <Barside activeItem="/tanksManagementFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  barside: { flex: 1 },
  container: { flex: 1, backgroundColor: "#fff" },

  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#388E3C",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  tabTextActive: {
    color: "#fff",
  },

  content: { flex: 1 },
});
