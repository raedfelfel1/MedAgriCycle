import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";

import plantsData from "../../plants_conditions_full.json";

export default function PlantSelector({ value, onSelectPlant }) {
  const { t } = useTranslation();
  const [isFocus, setIsFocus] = useState(false);

  const sortedPlants = [...plantsData.plants].sort((a, b) =>
    t(a.key).localeCompare(t(b.key))
  );

  const plantOptions = sortedPlants.map((plant) => ({
    label: t(plant.key),
    value: plant.key,
  }));

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#4CAF50" }]}
        data={plantOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={t("choosePlant")}
        searchPlaceholder={t("search")}
        value={value || null} 
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false);
          onSelectPlant(item.value); // key
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#aaa",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    color: "#333",
  },
});
