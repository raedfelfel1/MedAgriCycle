import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert,StyleSheet,Text,TextInput,TouchableOpacity,View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";

import { useData } from "../../app/dataContext";
import { useTemperatureUnit } from "../../context/hooks/useTemperatureUnit";
import plantsData from "../../plants_conditions_full.json";
import PlantSelector from "./plantSelector";


export default function ProductCard({ filteredProduct }) {
  const { t } = useTranslation();
  const [editableId, setEditableId] = useState(null);
  const [editData, setEditData] = useState({});
  const { unit } = useTemperatureUnit(0);
  const router = useRouter();
  const { updateProduct, deleteProduct } = useData();

  const categories = [
    { label: t("cereals"), value: "Céréales" },
    { label: t("vegetables"), value: "Légumes" },
    { label: t("fruits"), value: "Fruits" },
    { label: t("legumes"), value: "Légumineuses" },
    { label: t("aromaticPlants"), value: "Plantes aromatiques" },
  ];

  if (!Array.isArray(filteredProduct)) {
    return (
      <View style={styles.loading}>
        <Text>{t("loadingProducts")}</Text>
      </View>
    );
  }

  

  const handleEditClick = (product) => {
    setEditableId(product._id);
    setEditData({ ...product });
  };

  const handlePlantSelect = (plantName) => {
  const selectedPlant = plantsData.plants.find((p) => p.key === plantName);
  
      if (selectedPlant) {
        setEditData((prev) => ({
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
      } else {
    // si aucun plant trouvé, reset des valeurs
    setEditData((prev) => ({
      ...prev,
      plant: "",
      category: "Céréales",
      minTemperature: "",
      maxTemperature: "",
      minHumidite: "",
      maxHumidite: "",
      minPh: "",
      maxPh: "",
    }));
  }
};

  const handleConfirmClick = async () => {
    try {
      await updateProduct(editableId, editData);
      Alert.alert(t("success"), t("modifiedProduct"));
      setEditableId(null);
    } catch (err) {
      Alert.alert(t("error"), err.message || t("modificationError"));
    }
  };

  const handleDeleteClick = async (id) => {
  try {
    await deleteProduct(id);
    Alert.alert("Info", t("removedProduct"));

  } catch (err) {
    Alert.alert(t("error"), err.message || t("suppressionError"));
  }
};

const convertTemp = (celsius) => {
    if (unit === "fahrenheit") return (celsius * 9) / 5 + 32;
    if (unit === "kelvin") return celsius + 273.15;
    return celsius;
  };

  const formatTemp = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "-";
  }
  return `${convertTemp(value).toFixed(1)}${unitSymbol}`;
};

  const unitSymbol = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K",
  }[unit];

  return (
    <View style={styles.container}>
      {filteredProduct.map((product) => {
        const isEditing = editableId === product._id;
        const translatedCategory =
          categories.find((c) => c.value === product.category)?.label ||
          product.category;

        return (
        <TouchableOpacity
          key={product._id}
          activeOpacity={0.9}
          disabled={isEditing}
          onPress={() => {
            if (!isEditing) {
              router.push({
                pathname: "/(tabs)/farmFolder/tankDashboard",
                params: {
                  productId: product._id,
                  waterTankId: product.waterTank || "",
                  fertilizerTankId: product.fertilizerTank || "",
                },
              });
            }
          }}
        >
          
            <View style={styles.card}>
              <View style={styles.headerRow}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder={t("name")}
                    value={editData.name || ""}
                    onChangeText={(text) =>
                      setEditData((prev) => ({ ...prev, name: text }))
                    }
                  />
                ) : (
                  <Text style={styles.title}>{product.name}</Text>
                )}

                {isEditing ? (
                  <View style={styles.pickerContainer}>
                    <Dropdown
                      data={categories}
                      labelField="label"
                      valueField="value"
                      placeholder={t("category")}
                      value={editData.category}
                      onChange={(item) =>
                        setEditData((prev) => ({
                          ...prev,
                          category: item.value,
                        }))
                      }
                      style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6 }}
                      selectedTextStyle={{ fontSize: 14 }}
                      placeholderStyle={{ color: "#888" }}
                    />
                  </View>
                ) : (
                  <Text style={styles.category}>{translatedCategory}</Text>
                )}
              </View>

              {/* ✅ Ligne Plante */}
              <View style={styles.plantRow}>
                <Text style={styles.label}>{t("plant")}:</Text>
                {isEditing ? (
                <View style={{ flex: 1 }}>
                  <PlantSelector
                    value={editData.plant||""}
                    onSelectPlant={(selectedPlantName) => handlePlantSelect(selectedPlantName)}
                  />
                </View>
              ) : (
                <Text style={styles.value}>
                  {product.plant ? product.plant : t("noPlant")}
                </Text>
              )}
              </View>

              {/* Températures / Humidité / pH */}
              <View style={styles.infoGrid}>
                {/* Températures */}
                <View style={styles.doubleRow}>
                  <View style={styles.halfRowLeft}>
                    <Text style={styles.label}>{t("minTemp")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.minTemperature || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            minTemperature: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>
                        {formatTemp(product.minTemperature)}
                      </Text>
                    )}
                  </View>

                  <View style={styles.halfRowRight}>
                    <Text style={styles.label}>{t("maxTemp")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.maxTemperature || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            maxTemperature: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>
                        {formatTemp(product.maxTemperature)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Humidité */}
                <View style={styles.doubleRow}>
                  <View style={styles.halfRowLeft}>
                    <Text style={styles.label}>{t("minHumidity")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.minHumidite || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            minHumidite: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>{product.minHumidite}%</Text>
                    )}
                  </View>

                  <View style={styles.halfRowRight}>
                    <Text style={styles.label}>{t("maxHumidity")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.maxHumidite || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            maxHumidite: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>{product.maxHumidite}%</Text>
                    )}
                  </View>
                </View>

                {/* PH */}
                <View style={styles.doubleRow}>
                  <View style={styles.halfRowLeft}>
                    <Text style={styles.label}>{t("minPH")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.minPh || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            minPh: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>{product.minPh}</Text>
                    )}
                  </View>

                  <View style={styles.halfRowRight}>
                    <Text style={styles.label}>{t("maxPH")}:</Text>
                    {isEditing ? (
                      <TextInput
                        style={styles.inputSmall}
                        keyboardType="numeric"
                        value={String(editData.maxPh || "")}
                        onChangeText={(text) =>
                          setEditData((prev) => ({
                            ...prev,
                            maxPh: Number(text),
                          }))
                        }
                      />
                    ) : (
                      <Text style={styles.value}>{product.maxPh}</Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Date */}
              <Text style={styles.date}>
                {t("addedOn")} :{" "}
                {new Date(product.createdAt).toLocaleDateString(t("localDate"), {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>

              {/* Actions */}
              <View style={styles.actions}>
                {!isEditing ? (
                  <TouchableOpacity onPress={() => handleEditClick(product)}>
                    <MaterialIcons name="edit" size={22} color="orange" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleConfirmClick}>
                    <Ionicons name="checkmark-circle" size={22} color="green" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity>
                  <Ionicons name="location" size={22} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteClick(product._id)}>
                  <MaterialIcons name="delete" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor:"#f9f9f9" },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  plantRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  doubleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  halfRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "48%",
    gap: 4,
  },
  halfRowRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "48%",
    gap: 4,
  },
  label: { fontWeight: "500", color: "#444" },
  value: { color: "#000" },
  category: { fontWeight: "bold", color: "#444" },
  title: { fontWeight: "bold", fontSize: 16 },
  date: { fontSize: 12, color: "gray", marginTop: 5 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 4,
    textAlign: "center",
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 50,
    textAlign: "center",
  },
  picker: { height: 40, minWidth: 100 },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  loading: { padding: 20, alignItems: "center" },
});
