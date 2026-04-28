import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  darkMode = false,
}) {
  const { t } = useTranslation();

  const categ = [
    { label: t("cereals"), value: "Céréales" },
    { label: t("vegetables"), value: "Légumes" },
    { label: t("fruits"), value: "Fruits" },
    { label: t("legumes"), value: "Légumineuses" },
    { label: t("aromaticPlants"), value: "Plantes aromatiques" },
  ];
  const translatedCategories = categories.map((cat) => {
    const match = categ.find((c) => c.value === cat);
    return match ? { label: match.label, value: match.value } : null;
  })
  .filter(Boolean); // enlève les nulls
  
  // 🔹 Génère les options avec traduction via i18n
  const categoryOptions = [
    { label: t("allCategories"), value: "all" }, // "Toutes les catégories"
    ...translatedCategories.map((category) => ({
      label: category.label, // traduit à partir des clés de ton fichier i18n
      value: category.value,
    })),
  ];

  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <Dropdown
        style={[styles.dropdown, darkMode && styles.darkDropdown]}
        placeholderStyle={[styles.placeholderStyle, darkMode && styles.darkText]}
        selectedTextStyle={[styles.selectedTextStyle, darkMode && styles.darkText]}
        data={categoryOptions}
        labelField="label"
        valueField="value"
        placeholder="test"
        value={selectedCategory}
        onChange={(item) => onCategoryChange(item.value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  darkDropdown: {
    backgroundColor: "#222",
    borderColor: "#444",
  },
  darkText: { color: "#f1f1f1" },
  darkContainer: { backgroundColor: "#121212" },
});
