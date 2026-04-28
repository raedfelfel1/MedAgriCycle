// components/FertilizerTank.js
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import TankItem from "./tankItem";

export default function FertilizerTank({ tanks, setTanks }) {
  const { t } = useTranslation();
  const handleAddTank = () => {
    setTanks([
      ...tanks,
      { name: "", liquidType: "azote", capacity: 2000, type: "fertilizer" },
    ]);
  };

  const handleChange = (index, updatedTank) => {
    const newList = [...tanks];
    newList[index] = updatedTank;
    setTanks(newList);
  };

  const handleRemove = (index) => {
    const newList = tanks.filter((_, i) => i !== index);
    setTanks(newList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("fertilizerTank")}</Text>
      {tanks.map((tank, index) => (
        <TankItem
          key={index}
          tank={tank}
          index={index}
          type="fertilizer"
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTank}>
        <Text style={styles.addText}>{t("addFertilizerTank")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#2E7D32", marginBottom: 10 },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addText: { color: "white", fontWeight: "bold" },
});
