import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

import WaterTank from "../../../components/ui/waterTank";
import FertilizerTank from "../../../components/ui/fertilizerTank";
import { useData } from "../../dataContext";

export default function AddFarm() {
  const { createFarm, createTank } = useData();
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", location: "" });
  const [waterTanks, setWaterTanks] = useState([]);
  const [fertilizerTanks, setFertilizerTanks] = useState([]);

  const handleSubmit = async () => {
    try {
      const farm = await createFarm({
        name: formData.name,
        location: formData.location,
      });
      console.log("teeet : ",farm)
      if (!farm || !farm._id) throw new Error(t("farmCreationError"));

      // Créer tous les tanks liés à la ferme
      const allTanks = [...waterTanks, ...fertilizerTanks];
      for (const tank of allTanks) {
        await createTank({
          ...tank,
          linkedFarm: farm._id,
          createdAt: new Date(),
          unit: "L",
        });
      }

      Alert.alert(t("success"), t("farmCreatedSuccess"));
      router.replace("/farmFolder"); 
    } catch (err) {
      Alert.alert(t("error"), err.message || t("farmCreationError"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("newFarm")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("farmName")}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder={t("farmLocation")}
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />

      {/* Réservoirs */}
      <WaterTank tanks={waterTanks} setTanks={setWaterTanks} />
      <FertilizerTank tanks={fertilizerTanks} setTanks={setFertilizerTanks} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{t("createFarm")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
