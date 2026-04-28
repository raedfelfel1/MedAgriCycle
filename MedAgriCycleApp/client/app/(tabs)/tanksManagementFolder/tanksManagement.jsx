import { useState, useEffect,useMemo,useCallback} from "react";
import {View,Text,ScrollView,TouchableOpacity,ActivityIndicator,Alert,StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";


import { useData } from "../../dataContext";
import NavigationBottom from "../../../components/ui/navigationBottom";
import Barside from "../../../components/ui/barside";
import TankItem from "../../../components/ui/tankItem";

export default function TanksManagement() {
  const router = useRouter();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [newTank, setNewTank] = useState(null);
  const [activeFarmTank, setActiveFarmTank] = useState([]);

  const {
    createTank,
    deleteTank,
    selectedFarmId,
    setSelectedFarmId,
    farms,
    tanks,
  } = useData();

  useEffect(() => {
    if (farms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(farms[0]._id);
    }
  }, [farms]);

  useFocusEffect(
  useCallback(() => {
    if (!selectedFarmId) return;

    const filtered = tanks.filter(
      tank => String(tank.linkedFarm) === String(selectedFarmId)
    );

    setActiveFarmTank(filtered);

    return () => {
      // cleanup si besoin
    };
  }, [selectedFarmId, tanks])
);

  const farmTank = useMemo(() => {
    if (!selectedFarmId) return [];
    return tanks.filter(
      (tank) => String(tank.linkedFarm) === String(selectedFarmId)
    );
  }, [tanks, selectedFarmId]);

  const handleAddTank = (type) => {
    setIsEditing(true);
    setNewTank({
      name: "",
      type,
      liquidType: type === "water" ? t("freshWater") : t("nitrogen"),
      capacity: 100,
      unit: "L",
      linkedFarm: selectedFarmId,
    });
  };

  const handleConfirmAddTank = async () => {
    try {
      if (!newTank.name || !newTank.capacity) {
        Alert.alert(t("error"), t("fillAllFields"));
        return;
      }

      await createTank({
        ...newTank,
        createdAt: new Date(),
      });

      setIsEditing(false);
      setNewTank(null);
      Alert.alert(t("success"), t("tankAddedSuccess"));
    } catch (err) {
      console.error(err);
      Alert.alert(t("error"), t("cannotCreateTank"));
    }
  };

  const handleCancelAddTank = () => {
    setIsEditing(false);
    setNewTank(null);
  };

  const handleDeleteTank = async (tankId) => {
    Alert.alert(t("deleteTankTitle"), t("deleteTankConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTank(tankId);
          } catch (err) {
            console.error(err);
            Alert.alert(t("error"), t("cannotDeleteTank"));
          }
        },
      },
    ]);
  };

  const waterTanks = farmTank.filter((t) => t.type === "water" || t.type === "water_fertilizer");
  const fertilizerTanks = farmTank.filter((t) => t.type === "fertilizer" || t.type === "water_fertilizer");

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <NavigationBottom
          onFarmSelect={setSelectedFarmId}
          selectedFarmId={selectedFarmId}
          farms={farms}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {!selectedFarmId ? (
            <Text style={styles.infoText}>{t("selectFarm")}</Text>
          ) : (
            <>
              {/* Water tanks */}
              <Text style={styles.groupTitle}>{t("waterTanks")}</Text>
              <View style={styles.group}>
                {waterTanks.map((tank) => (
                  <TouchableOpacity
                    key={tank._id}
                    style={styles.tankCard}
                    onPress={() =>
                      !isEditing &&
                      router.push({
                        pathname: "/(tabs)/tanksManagementFolder/tankDetailDashboard",
                        params: {
                          tankId: tank._id,
                          tankType: tank.type,
                          farmId: tank.linkedFarm,
                        },
                      })
                    }
                  >
                    <Ionicons name="water-outline" size={24} color="#007BFF" />
                    <Text style={styles.tankName}>{tank.name}</Text>
                    <Ionicons name="chevron-forward-outline" size={22} color="#007BFF" />
                  </TouchableOpacity>
                ))}

                {isEditing && newTank?.type === "water" ? (
                  <>
                    <TankItem
                      tank={newTank}
                      index={0}
                      type="water"
                      onChange={(i, updated) => setNewTank(updated)}
                      onRemove={handleCancelAddTank}
                    />
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.confirmButton, { backgroundColor: "#4CAF50" }]}
                        onPress={handleConfirmAddTank}
                      >
                        <Text style={styles.confirmText}>{t("confirm")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.confirmButton, { backgroundColor: "#f44336" }]}
                        onPress={handleCancelAddTank}
                      >
                        <Text style={styles.confirmText}>{t("cancel")}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  !isEditing && (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddTank("water")}
                    >
                      <Ionicons name="add-circle-outline" size={26} color="green" />
                      <Text style={styles.addText}>{t("addWaterTank")}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>

              {/* 🌾 Fertilizer tanks */}
              <Text style={styles.groupTitle}>{t("fertilizerTanks")}</Text>
              <View style={styles.group}>
                {fertilizerTanks.map((tank) => (
                  <TouchableOpacity
                    key={tank._id}
                    style={styles.tankCard}
                    onPress={() =>
                      !isEditing &&
                      router.push({
                        pathname: "/(tabs)/tanksManagementFolder/tankDetailDashboard",
                        params: {
                          tankId: tank._id,
                          tankType: tank.type,
                          farmId: tank.linkedFarm,
                        },
                      })
                    }
                  >
                    <Ionicons name="flask-outline" size={24} color="#8B4513" />
                    <Text style={styles.tankName}>{tank.name}</Text>
                    <Ionicons name="chevron-forward-outline" size={22} color="#8B4513" />
                  </TouchableOpacity>
                ))}

                {isEditing && newTank?.type === "fertilizer" ? (
                  <>
                    <TankItem
                      tank={newTank}
                      index={0}
                      type="fertilizer"
                      onChange={(i, updated) => setNewTank(updated)}
                      onRemove={handleCancelAddTank}
                    />
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.confirmButton, { backgroundColor: "#4CAF50" }]}
                        onPress={handleConfirmAddTank}
                      >
                        <Text style={styles.confirmText}>{t("confirm")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.confirmButton, { backgroundColor: "#f44336" }]}
                        onPress={handleCancelAddTank}
                      >
                        <Text style={styles.confirmText}>{t("cancel")}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  !isEditing && (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddTank("fertilizer")}
                    >
                      <Ionicons name="add-circle-outline" size={26} color="green" />
                      <Text style={styles.addText}>{t("addFertilizerTank")}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <Barside activeItem="/tanksManagementFolder" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  page: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 16, paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoText: { textAlign: "center", color: "#666", marginTop: 20 },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  group: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
  },
  tankCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tankName: { flex: 1, marginLeft: 10, color: "#333" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  addText: { marginLeft: 6, color: "green", fontWeight: "500" },
  actionRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  confirmButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  confirmText: { color: "white", fontWeight: "bold" },
});
