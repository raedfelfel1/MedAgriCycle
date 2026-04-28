import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context"

import { useData } from "../../dataContext";
import plantsData from "../../../plants_conditions_full.json"; 
import PlantSelector from "../../../components/ui/plantSelector";

export default function AddProduct() {
  const { t } = useTranslation();
  const router = useRouter();
  const { createProduct, tanks } = useData();
  const { farmId } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    plant: "",
    category: "Céréales",
    minTemperature: "",
    maxTemperature: "",
    minHumidite: "",
    maxHumidite: "",
    minPh: "",
    maxPh: "",
  });

  const [selectedWaterTank, setSelectedWaterTank] = useState(null);
  const [selectedFertilizerTank, setSelectedFertilizerTank] = useState(null);

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    severity: "success",
  });

  const safeParse = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  // On remplit tous les attribut d'un produit avec les caracteristiques de la plante dans le fichier json
  const handlePlantSelect = (plantName) => {
    const selectedPlant = plantsData.plants.find((p) => p.key === plantName);

    if (selectedPlant) {
      setFormData((prev) => ({
        ...prev,
        plant: plantName,
        category: selectedPlant.type,
        minTemperature: String(selectedPlant.temperature.min),
        maxTemperature: String(selectedPlant.temperature.max),
        minHumidite: String(selectedPlant.humidity.min),
        maxHumidite: String(selectedPlant.humidity.max),
        minPh: String(selectedPlant.soil_ph.min),
        maxPh: String(selectedPlant.soil_ph.max),
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "plant",
      "minTemperature",
      "maxTemperature",
      "minHumidite",
      "maxHumidite",
      "minPh",
      "maxPh",
    ];

    let hasError = false;
    requiredFields.forEach((f) => {
      if (!formData[f]) {
        newErrors[f] = true;
        hasError = true;
      }
    });

    setErrors(newErrors);
    if (hasError) {
      setSnackbar({
        visible: true,
        message: t("pleaseFillAllFields"),
        severity: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    console.log("1")
    if (!validateForm()) return;
    console.log("2")
    try {
      const productToSend = {
        ...formData,
        minTemperature: safeParse(formData.minTemperature),
        maxTemperature: safeParse(formData.maxTemperature),
        minHumidite: safeParse(formData.minHumidite),
        maxHumidite: safeParse(formData.maxHumidite),
        minPh: safeParse(formData.minPh),
        maxPh: safeParse(formData.maxPh),
        farm: farmId,
        waterTank: selectedWaterTank,
        fertilizerTank: selectedFertilizerTank,
      };
      console.log("3")
      await createProduct(productToSend);
      console.log("4")
      setSnackbar({
        visible: true,
        message: t("productCreated"),
        severity: "success",
      });
      console.log("5")
      setTimeout(() => {
        router.replace("/farmFolder");
      }, 1500);
    } catch (err) {
      setSnackbar({
        visible: true,
        message: err.message || t("productCreateError"),
        severity: "error",
      });
    }
  };

  // 👉 Filtrer les tanks pour la ferme actuelle
  const farmTanks = tanks.filter(t => t.linkedFarm === farmId);
  const waterTanks = farmTanks.filter(t => t.type === "water" || t.type==="water_fertilizer");
  const fertilizerTanks = farmTanks.filter(t => t.type === "fertilizer" || t.type==="water_fertilizer");
  const TankSelector = ({ title, tanks, selectedTank, setSelectedTank }) => (
  <View style={styles.sectionBox}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {tanks.length === 0 ? (
      <Text style={{ fontStyle: "italic", color: "#888" }}>{t("noTankAvailable")}</Text>
    ) : (
      tanks.map((tank) => (
        <TouchableOpacity
          key={tank._id}
          style={[
            styles.tankButton,
            selectedTank === tank._id && styles.tankButtonSelected,
          ]}
          onPress={() =>
            setSelectedTank(selectedTank === tank._id ? null : tank._id)
          }
        >
          <Text style={styles.tankText}>
            {tank.name} ({tank.liquidType})
          </Text>
        </TouchableOpacity>
      ))
    )}
  </View>
);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t("newProductTitle")}</Text>

        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>{t("plantSelection")}</Text>
          <PlantSelector value={formData.plant} onSelectPlant={handlePlantSelect} />
          <TextInput
            label={t("productName")}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
            style={styles.input}
          />
        </View>

        <TankSelector
          title={t("waterTank")}
          tanks={waterTanks}
          selectedTank={selectedWaterTank}
          setSelectedTank={setSelectedWaterTank}
        />

        <TankSelector
          title={t("fertilizerTank")}
          tanks={fertilizerTanks}
          selectedTank={selectedFertilizerTank}
          setSelectedTank={setSelectedFertilizerTank}
        />

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            {t("addProduct")}
          </Button>
          <Button mode="outlined" onPress={() => router.push("/farmFolder")} style={styles.backButton}>
            {t("back")}
          </Button>
        </View>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={4000}
          style={[
            snackbar.severity === "error" ? styles.errorSnackbar : styles.successSnackbar,
            styles.topSnackbar,
          ]}
        >
          {snackbar.message}
        </Snackbar>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  sectionBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2e7d32",
  },
  tankButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
  },
  tankButtonSelected: {
    backgroundColor: "#c8e6c9",
    borderColor: "#4CAF50",
  },
  tankText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  submitButton: { backgroundColor: "#4CAF50", flex: 1, marginHorizontal: 5 },
  backButton: { borderColor: "#4CAF50", flex: 1, marginHorizontal: 5 },
  errorSnackbar: { backgroundColor: "#e53935" },
  successSnackbar: { backgroundColor: "#43a047" },
  topSnackbar: { position: "absolute", top: 20, left: 10, right: 10, borderRadius: 8 },
});
