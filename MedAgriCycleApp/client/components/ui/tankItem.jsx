import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

export default function TankItem({ tank, index, onChange, onRemove, type }) {
  const { t } = useTranslation();

  const handleChange = (field, value) => {
    onChange(index, { ...tank, [field]: value });
  };

  // on définit ici la vraie valeur envoyée au serveur
  // et le libellé affiché à l’utilisateur (traduit)
  const liquidOptions =
    type === "water"
      ? [
          { value: "eau douce", label: t("freshWater") },
          { value: "eau de pluie", label: t("rainWater") },
          { value: "eau recyclée", label: t("recycledWater") },
          { value: "eaux usées", label: t("wasteWater") },
        ]
      : [
          { value: "azote", label: t("nitrogen") },
          { value: "phosphate", label: t("phosphate") },
          { value: "potassium", label: t("potassium") },
          { value: "organique", label: t("organic") },
        ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {type === "water"
          ? `${t("waterTank")} #${index + 1}`
          : `${t("fertilizerTank")} #${index + 1}`}
      </Text>

      <TextInput
        placeholder={t("tankName")}
        style={styles.input}
        value={tank.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <Text style={styles.label}>{t("liquidType")} :</Text>
      <View style={styles.typeContainer}>
        {liquidOptions.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.typeButton,
              tank.liquidType === value && styles.typeButtonActive,
            ]}
            onPress={() => handleChange("liquidType", value)} // ⚙️ Envoie la "vraie" valeur
          >
            <Text
              style={[
                styles.typeText,
                tank.liquidType === value && styles.typeTextActive,
              ]}
            >
              {label} {/* 👁️ Affiche le texte traduit */}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder={t("capacityLiters")}
        keyboardType="numeric"
        style={styles.input}
        value={String(tank.capacity || "")}
        onChangeText={(text) =>
          handleChange("capacity", parseFloat(text) || 0)
        }
      />

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(index)}
      >
        <Text style={styles.removeText}>{t("deleteTank")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginBottom: 5 },
  typeContainer: { flexDirection: "row", flexWrap: "wrap" },
  typeButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 3,
  },
  typeButtonActive: { backgroundColor: "#4CAF50" },
  typeText: { color: "#4CAF50" },
  typeTextActive: { color: "white" },
  removeButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  removeText: { color: "white", fontWeight: "bold" },
});
