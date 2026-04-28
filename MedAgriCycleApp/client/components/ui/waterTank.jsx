import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TankItem from "./tankItem";
import { useTranslation } from "react-i18next";

export default function WaterTank({ tanks, setTanks }) {
  const { t } = useTranslation();
  const handleAddTank = () => {
    setTanks([
      ...tanks,
      { name: "", liquidType: "eau douce", capacity: 1000, type: "water" },
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
      <Text style={styles.title}>{t("waterTank")}</Text>
      {tanks.map((tank, index) => (
        <TankItem
          key={index}
          tank={tank}
          index={index}
          type="water"
          onChange={handleChange}
          onRemove={handleRemove}
        />
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTank}>
        <Text style={styles.addText}>{t("addWaterTank")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3F2FD",
    padding: 10,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1565C0", marginBottom: 10 },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  addText: { color: "white", fontWeight: "bold" },
});
