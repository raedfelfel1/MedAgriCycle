import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-native-element-dropdown"; 

import i18n from "../../../i18n";
import BarSide from "../../../components/ui/barside";

// Constantes
const TEMPERATURE_UNITS = {
  celsius: "Celsius (°C)",
  fahrenheit: "Fahrenheit (°F)",
  kelvin: "Kelvin (K)",
};

const LANGUAGES = {
  fr: "Français",
  en: "English",
};

export default function Setting() {
  const { t } = useTranslation();

  const [darkMode, setDarkMode] = useState(false);
  const [unit, setUnit] = useState("celsius");
  const [language, setLanguage] = useState("fr");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isChangingLang, setIsChangingLang] = useState(false);

  // Chargement des préférences au montage
  useEffect(() => {
  const loadSettings = async () => {
    try {
      const dark = await AsyncStorage.getItem("darkMode");
      const u = await AsyncStorage.getItem("tempUnit");
      const langStored = await AsyncStorage.getItem("language");
      const notif = await AsyncStorage.getItem("notificationsEnabled");

      if (dark !== null) setDarkMode(dark === "true");
      if (u) setUnit(u);
      if (notif !== null) setNotificationsEnabled(notif === "true");

      // 🔄 Synchronisation langue réelle
      const currentLang = langStored || i18n.language || "en";
      setLanguage(currentLang);
      if (i18n.language !== currentLang) {
        await i18n.changeLanguage(currentLang);
      }
    } catch (e) {
      console.log("Erreur de chargement des préférences :", e);
    }
  };
  loadSettings();
}, []);

  // Sauvegarde du mode sombre
  useEffect(() => {
    AsyncStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Sauvegarde de l’unité
  useEffect(() => {
    AsyncStorage.setItem("tempUnit", unit);
  }, [unit]);

  // Sauvegarde des notifications
  useEffect(() => {
    AsyncStorage.setItem("notificationsEnabled", String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Gestion du changement de langue
  const handleLanguageChange = useCallback(
    async (newLang) => {
      if (isChangingLang || !newLang || newLang === language) return;

      setIsChangingLang(true);
      try {
        setLanguage(newLang);
        await AsyncStorage.setItem("language", newLang);
        await i18n.changeLanguage(newLang);
        console.log("✅ Langue changée en :", newLang);
      } catch (err) {
        console.error("Erreur lors du changement de langue :", err);
      } finally {
        setIsChangingLang(false);
      }
    },
    [isChangingLang, language]
  );

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  // Conversion des objets en tableaux pour le Dropdown
  const tempUnitOptions = Object.entries(TEMPERATURE_UNITS).map(([key, label]) => ({
    label,
    value: key,
  }));

  const languageOptions = Object.entries(LANGUAGES).map(([key, label]) => ({
    label,
    value: key,
  }));

  return (
    <View style={styles.barside}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          darkMode && styles.darkBackground,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, darkMode && styles.darkText]}>
          {t("appParam")}
        </Text>

        {/* Mode sombre */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
              {t("darkMode")}
            </Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
          <Text style={[styles.description, darkMode && styles.darkText]}>
            {t("darkModeDesc")}
          </Text>
        </View>

        {/* Unité de température */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
            {t("tempUnit")}
          </Text>
          <Dropdown
            style={[styles.dropdown, darkMode && styles.darkDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={[styles.selectedTextStyle, darkMode && styles.darkText]}
            data={tempUnitOptions}
            labelField="label"
            valueField="value"
            placeholder={t("selectTempUnit")}
            value={unit}
            onChange={(item) => setUnit(item.value)}
          />
        </View>

        {/* Langue */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
            {t("language")}
          </Text>
          <Dropdown
            style={[styles.dropdown, darkMode && styles.darkDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={[styles.selectedTextStyle, darkMode && styles.darkText]}
            data={languageOptions}
            labelField="label"
            valueField="value"
            placeholder={t("selectLanguage")}
            value={language}
            onChange={(item) => handleLanguageChange(item.value)}
            disable={isChangingLang}
          />
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, darkMode && styles.darkText]}>
              {t("notifications")}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <Text style={[styles.description, darkMode && styles.darkText]}>
            {t("notifDesc")}
          </Text>
        </View>
      </ScrollView>

      <BarSide activeItem="/settingsFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  darkBackground: { backgroundColor: "#121212" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  darkDropdown: {
    backgroundColor: "#222",
    borderColor: "#444",
  },
  dropdown: {
    marginTop: 8,
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
  darkText: { color: "#f1f1f1" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  description: { marginTop: 8, fontSize: 14, color: "#555" },
  barside: { flex: 1 },
});
