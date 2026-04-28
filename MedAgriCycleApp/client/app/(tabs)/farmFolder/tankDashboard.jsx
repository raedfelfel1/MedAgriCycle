import { useState} from "react";
import {View,Text,TouchableOpacity,StyleSheet,ScrollView,} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import ProductDashboard from "../../../components/ui/productDashboard";
import { useData } from "../../dataContext"
import TankControl from "../../../components/ui/tankControl";
import Barside from "../../../components/ui/barside";

export default function TankDashboard() {
  const { t } = useTranslation();
  const { productId, waterTankId, fertilizerTankId,main } = useLocalSearchParams();
  const [mainTab, setMainTab] = useState(main || "tank"); // "tank" ou "graphs"
  const [activeTab, setActiveTab] = useState("water");
  
  const { tanksLastLevel } = useData();
  
  const waterTankKey = waterTankId ? String(waterTankId) : null;
  const fertilizerTankKey = fertilizerTankId ? String(fertilizerTankId) : null;
  
  let fertilizeTankLevel = null;
  let waterTankLevel = null;
  if(fertilizerTankKey && tanksLastLevel?.[fertilizerTankKey] !== undefined){
    fertilizeTankLevel=tanksLastLevel[fertilizerTankId];
  }

  if(waterTankKey && tanksLastLevel?.[waterTankKey] !== undefined){
    waterTankLevel=tanksLastLevel[waterTankId];
  }
  return (
    <View style={styles.barside}>
      <View style={styles.container}>
        {/* 🔹 Barre supérieure : contrôle / graphiques */}
        <View style={styles.mainTabRow}>
          <TouchableOpacity
            style={[
              styles.mainTabButton,
              mainTab === "tank" && styles.mainTabButtonActive,
            ]}
            onPress={() => setMainTab("tank")}
          >
            <Text
              style={[
                styles.mainTabText,
                mainTab === "tank" && styles.mainTabTextActive,
              ]}
            >
              {t("tank")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainTabButton,
              mainTab === "graphs" && styles.mainTabButtonActive,
            ]}
            onPress={() => setMainTab("graphs")}
          >
            <Text
              style={[
                styles.mainTabText,
                mainTab === "graphs" && styles.mainTabTextActive,
              ]}
            >
              {t("graphs")}
            </Text>
          </TouchableOpacity>
        </View>

        {/*Sous-barre : eau / fertilisant (visible seulement si "contrôle") */}
        {mainTab === "tank" && (
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "water" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("water")}
              disabled={!waterTankId}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "water" && styles.tabTextActive,
                ]}
              >
                {t("waterTank")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "fertilizer" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("fertilizer")}
              disabled={!fertilizerTankId}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "fertilizer" && styles.tabTextActive,
                ]}
              >
                {t("fertilizerTank")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🔹 Contenu */}
        <ScrollView style={styles.content}>
          {mainTab === "tank" ? (
            activeTab === "water" && waterTankId ? (
              <TankControl tankId={waterTankId} tankLevel={waterTankLevel} productId={productId} tankType="water" />
            ) : activeTab === "fertilizer" && fertilizerTankId ? (
              <TankControl tankId={fertilizerTankId} tankLevel={fertilizeTankLevel} productId={productId} tankType="fertilizer" />
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t("noTankLinked")}</Text>
              </View>
            )
          ) : (
            <ProductDashboard productId={productId} />
          )}
        </ScrollView>
      </View>

      <Barside activeItem="/farmFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  barside: { flex: 1 },
  container: { flex: 1, backgroundColor: "#fff" },

  // 🔹 Barre principale : contrôle / graphiques
  mainTabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  mainTabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  mainTabButtonActive: {
    backgroundColor: "#388E3C",
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  mainTabTextActive: {
    color: "#fff",
  },

  // 🔹 Sous-barre : eau / fertilisant
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#f3f3f3",
    borderRightWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  tabButtonActive: { backgroundColor: "#50AC54" },
  tabText: { fontSize: 16, color: "#444", fontWeight: "500" },
  tabTextActive: { color: "#fff" },

  content: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center" },
});
