import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback,useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,useWindowDimensions  } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import Markdown from 'react-native-markdown-display';

import { useData } from "../../dataContext"
import BarSide from "../../../components/ui/barside";
import { generateRecommendations } from "../../../services/api";
import NavigationBottom from "../../../components/ui/navigationBottom"

// Formatage du texte enrichi (gras, listes, paragraphes)
const inlineFormat = (text) => {
  if (!text) return null;
  const parts = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(<Text key={`b-${m.index}`} style={{ fontWeight: "bold" }}>{m[1]}</Text>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
};

const renderRichText = (message) => {
  if (!message) return null;
  const rawLines = message.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const out = [];
  let i = 0;
  let groupKey = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];

    // Liste numérotée
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < rawLines.length && /^\d+\.\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <View key={`ol-${groupKey++}`} style={{ marginVertical: 4 }}>
          {items.map((t, idx) => (
            <Text key={idx} style={styles.listItem}>• {inlineFormat(t)}</Text>
          ))}
        </View>
      );
      continue;
    }

    // Liste à puces
    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < rawLines.length && /^-\s+/.test(rawLines[i])) {
        items.push(rawLines[i].replace(/^-\s+/, ""));
        i++;
      }
      out.push(
        <View key={`ul-${groupKey++}`} style={{ marginVertical: 4 }}>
          {items.map((t, idx) => (
            <Text key={idx} style={styles.listItem}>• {inlineFormat(t)}</Text>
          ))}
        </View>
      );
      continue;
    }

    // Paragraphe
    out.push(
      <Text key={`p-${groupKey++}`} style={styles.paragraph}>
        {inlineFormat(line)}
      </Text>
    );
    i++;
  }

  return <View>{out}</View>;
};

// Composant principal
export default function Recommandation() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filterName, setFilterName] = useState("");  
  const [displayRecs, setDisplayRecs] = useState([]);
  const { width } = useWindowDimensions();

  const { selectedFarmId,setSelectedFarmId, products,farms} = useData()
  const { t } = useTranslation();

  // Charger fermes de l'utilisateur
  

useFocusEffect(
  useCallback(() => {
    console.log("recs")
    setFilterName("");
    setDisplayRecs([]);
  }, [selectedFarmId, products])
);

  // Génération manuelle
  const handleGenerate = async () => {
    if (!selectedFarmId) return;
    try {
      let data;
      setLoading(true);
      data = await generateRecommendations(selectedFarmId,t("localDate"));
      setDisplayRecs(Array.isArray(data) ? data : []);
      console.log("RECS TROUVÉES : ",data)
    } catch {
      console.error(t("errorGenerating"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
      <ScrollView>
        <NavigationBottom
          onFarmSelect={setSelectedFarmId}
          selectedFarmId={selectedFarmId}
          farms={farms}
        />
        <View style={styles.main}>
          {/* Titre */}
          <Text style={styles.title}>{t("recommandations")}</Text>
          <Text style={styles.subtitle}>{t("subtitle")}</Text>

          {/* Filtre par nom de culture */}
          <TextInput
            placeholder={t("filterPlaceholder")}
            value={filterName}
            onChangeText={setFilterName}
            style={styles.input}
          />

          {/* Sélecteur de ferme + boutons */}
          <View style={styles.actions}>


            <TouchableOpacity
              style={[styles.button, (!selectedFarmId || loading) && styles.disabled]}
              onPress={handleGenerate}
              disabled={!selectedFarmId || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? t("loading") : t("generate")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.themeBtn} onPress={() => setDarkMode(!darkMode)}>
              <MaterialCommunityIcons
                name={darkMode ? "weather-sunny" : "weather-night"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          {/* Liste des recommandations */}
          {displayRecs
          .filter((rec) =>
            rec.productName?.toLowerCase().includes(filterName.toLowerCase())
          )
          .map((rec, idx) => (
            <View key={idx} style={[styles.card, darkMode && styles.darkCard]}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="sprout" size={20} />
                <Text style={styles.cardTitle}>
                  {rec.productName || t("unknownCrop")}
                </Text>
              </View>
              <View style={styles.cardChips}>
                <Text>{t("temperature")} : {rec.temperature ?? "–"}°C</Text>
                <Text>{t("humidity")} : {rec.humidity ?? "–"}%</Text>
                <Text>{t("ph")} : {rec.ph ?? "–"}</Text>
              </View>

              <Markdown>
                {rec.message}
              </Markdown>
            </View>
          ))}

        {displayRecs.length === 0 && (
          <Text>{t("noRecommandation")}</Text>
        )}
        </View>
      </ScrollView>

      <BarSide activeItem="/recommandationsFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  dark: { backgroundColor: "#121212" },
  main: { flexGrow: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 16 },
  actions: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  picker: { flex: 1, height: 50 },
  button: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 8, marginHorizontal: 8 },
  buttonText: { color: "white", fontWeight: "bold" },
  disabled: { backgroundColor: "#ccc" },
  themeBtn: { padding: 8, backgroundColor: "#e0e0e0", borderRadius: 8 },
  card: { backgroundColor: "white", padding: 16, borderRadius: 8, marginBottom: 16 },
  darkCard: { backgroundColor: "#1e1e1e" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { marginLeft: 8, fontWeight: "bold" },
  cardChips: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardBody: { marginTop: 8 },
  listItem: { fontSize: 14, marginBottom: 4 },
  paragraph: { fontSize: 14, marginBottom: 8 }
});
