import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";

export default function SearchBar({ onSearch }) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#555" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={t("searchProduct")}
        onChangeText={onSearch}
        placeholderTextColor="#888"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});
