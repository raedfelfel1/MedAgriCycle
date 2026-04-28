import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet,Text,TouchableOpacity,View,ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../app/authContext";

export default function NavigationBottom({ onFarmSelect, selectedFarmId, farms = [] }) {
  const { t } = useTranslation();
  //const [value, setValue] = useState(selectedFarmId || null);
  const router = useRouter();
  const { user } = useAuth();

 useEffect(() => {
  if (!selectedFarmId && farms.length > 0) {
    onFarmSelect(farms[0]._id);
  }
}, [farms, selectedFarmId]);

  const handleChange = async (newValue) => {
    if (newValue !== "add") {
      onFarmSelect?.(newValue);
    } else {
      router.push("/(tabs)/farmFolder/addFarm");
    }
  };

  // 🌾 Si aucune ferme n'existe → message d'accueil avec bouton +
  if (!farms.length) {
    return (
      <View style={styles.emptyWrapper}>
        <Ionicons name="leaf-outline" size={42} color="green" />
        <Text style={styles.emptyTitle}>
          {t("noFarmYet") || "Aucune ferme créée"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {t("createFirstFarm") || "Créez votre première ferme dès maintenant !"}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleChange("add")}
        >
          <Ionicons name="add-circle" size={40} color="white" />
          <Text style={styles.addButtonText}>
            {t("addFarm") || "Créer une ferme"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🌿 Sinon, affichage normal avec les fermes
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {farms.map((farm) => (
          <TouchableOpacity
            key={farm._id}
            style={[styles.item, selectedFarmId === farm._id && styles.activeItem]}
            onPress={() => handleChange(farm._id)}
          >
            <Ionicons
              name="leaf"
              size={24}
              color={selectedFarmId === farm._id ? "white" : "green"}
            />
            <Text style={[styles.label, selectedFarmId === farm._id && styles.activeLabel]}>
              {farm.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bouton + fixe à droite */}
      <TouchableOpacity
        style={[styles.item, styles.addItem]}
        onPress={() => handleChange("add")}
      >
        <Ionicons name="add-circle" size={30} color="green" />
        <Text style={styles.label}>{t("add") || "Ajouter"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  item: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: "green",
  },
  label: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  activeLabel: {
    color: "white",
    fontWeight: "bold",
  },
  addItem: {
    borderLeftWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 15,
    marginRight: 10,
  },
  // 🧩 Styles du mode "aucune ferme"
  emptyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 8,
  },
});
