import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import TankConsumptionChart from "../../../components/ui/tankConsumptionChart";
import Barside from "../../../components/ui/barside"

export default function ProductDetail() {
  const { t } = useTranslation();
  const route = useRoute();

  const productId = route.params?.productId;
  const tankId=route.params?.tankId;
    console.log("variablesDetail : ",tankId,productId)
  const [selectedHours, setSelectedHours] = useState(24);
    console.log("dans detail")
  const OPTIONS = [
    { label: "24h", value: 24 },
    { label: "48h", value: 48 },
    { label: "7j", value: 168 },
    { label: "1 mois", value: 720 },
  ];

  if (!productId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Aucun produit sélectionné.</Text>
      </View>
    );
  }

  return (
    <View style={styles.barside}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* ----- Boutons de sélection ----- */}
        <View style={styles.buttonRow}>
          {OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.button,
                selectedHours === opt.value && styles.buttonActive,
              ]}
              onPress={() => setSelectedHours(opt.value)}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedHours === opt.value && styles.buttonTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ----- Graphique consommation ----- */}
        <TankConsumptionChart productId={productId} hours={selectedHours} tankId={tankId} />

      </ScrollView>
      <Barside activeItem="/tanksManagementFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: "row",
    marginBottom: 20,
    width: "100%",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonActive: {
    backgroundColor: "#6366f1",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  buttonTextActive: {
    color: "white",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 18,
  },
  barside:{
    flex: 1,
  }
});
