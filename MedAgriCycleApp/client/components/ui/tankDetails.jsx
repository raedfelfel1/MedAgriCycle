import { useEffect, useState } from "react";
import { View,Text,StyleSheet,TouchableOpacity,ActivityIndicator,Alert,TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { fetchTankById, fetchTankHistoryById, deleteTank,fetchProductsByTank } from "../../services/api"; 
import { useData } from "../../app/dataContext";

export default function TankDetails({ tankId, tankType }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [tankName, setTankName] = useState("");
  const [editedName, setEditedName] = useState(""); 
  const [editing, setEditing] = useState(false); 
  const [error, setError] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  
  const {handleUpdateTankName} = useData();
  const tankColor = tankType === "water" ? "dodgerblue" : "#4CAF50";
  
  useEffect(() => {
    const loadTankData = async () => {
      try {
        if (!tankId) {
          setError(t("noTankLinked"));
          setLoading(false);
          return;
        }
        
        const products = await fetchProductsByTank(tankId);
        const map = {};
        products.forEach(p => {
          map[p._id] = p.name;
        });
        setProductsMap(map);
        
        const tankData = await fetchTankById(tankId);
        if (!tankData) {
          setError(t("tankNotFound"));
          setLoading(false);
          return;
        }
        
        setMaxCapacity(tankData.capacity || 100);
        setTankName(tankData.name);
        setEditedName(tankData.name); // 🔥 Init nom modifiable
        
        const data = await fetchTankHistoryById(tankId);
        
        if (!data || data.length === 0) {
          setHistory([]);
          setCurrentLevel(0);
        } else {
          const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setHistory(sortedData);
          setCurrentLevel(sortedData[0].newLevel ?? 0);
        }
        
        
      } catch (err) {
        console.error("Erreur chargement tank :", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };
    
    loadTankData();
  }, [tankId]);
  
  const handleSaveName = async () => {
    try {
      await handleUpdateTankName(tankId, editedName);
      setTankName(editedName);
      setEditing(false);
      Alert.alert(t("success"), t("tankNameUpdated"));
    } catch (err) {
      console.error(err);
      Alert.alert(t("error"), t("updateError"));
    }
  };
  
  const handleDeleteTank = () => {
    Alert.alert(
      t("confirmDelete"),
      t("deleteTankQuestion"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTank(tankId);
              Alert.alert(t("tankDeleted"));
            } catch (err) {
              console.error(err);
              Alert.alert(t("error"), t("deleteError"));
            }
          },
        },
      ]
    );
  };
  
  const handleRefill = () => {
    setCurrentLevel(maxCapacity);
  };
  
  if (loading) {
    return (
      <View style={styles.center}>
      <ActivityIndicator size="large" color={tankColor} />
      <Text>{t("loading")}</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.center}>
      <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  
  return (
    
    <View style={styles.container}>
    
    {/* 🔥 Édition nom du tank */}
      <View style={styles.panel}>
      
      {editing ? (
        <View style={styles.nameRow}>
        <TextInput
        style={[styles.input, { flex: 1 }]}
        value={editedName}
        onChangeText={setEditedName}
        />
        <TouchableOpacity style={styles.saveIcon} onPress={handleSaveName}>
        <MaterialIcons name="check" size={24} color={tankColor} />
        </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.nameRow}>
        <Text style={styles.tankName}>{tankName}</Text>
        <TouchableOpacity onPress={() => setEditing(true)}>
        <MaterialIcons name="edit" size={24} color={tankColor} />
        </TouchableOpacity>
        </View>
      )}
      </View>
      
      {/* 🔥 Bouton suppression */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteTank}>
      <Text style={styles.deleteText}>{t("deleteTank")}</Text>
      </TouchableOpacity>
      
      {/* Niveau actuel */}
      <View style={styles.panel}>
      <Text style={styles.subtitle}>{t("tankLevel")}</Text>
      <View style={styles.barContainer}>
      <View
      style={[
        styles.barFill,
        { width: `${(currentLevel / maxCapacity) * 100}%`, backgroundColor: tankColor },
      ]}
      />
      </View>
      
      <Text style={styles.barLabel}>{currentLevel}L / {maxCapacity}L</Text>
      
      <TouchableOpacity style={[styles.button, { backgroundColor: tankColor }]} onPress={handleRefill}>
      <MaterialIcons name="autorenew" size={20} color="white" />
      <Text style={styles.buttonText}>{t("fillTank")}</Text>
      </TouchableOpacity>
      </View>
      
      {/* Historique */}
      <View style={styles.panel}>
      <Text style={styles.subtitle}>{t("consumptionHistory")}</Text>
      
      {history.length === 0 ? (
        <Text>{t("noConsumptionHistory")}</Text>
      ) : (
        history.map((item, idx) => (
          <View key={idx} style={styles.historyItem}>
          <Text style={[styles.historyText, { color: tankColor }]}>{t(item.action)}</Text>
          <Text style={styles.historyText}>
          {t("product")} : {productsMap[item.product] ?? t("unknownProduct")}
          </Text>
          <Text style={styles.historyText}>{t("used")}: {item.quantity} L</Text>
          <Text style={styles.historyText}>{t("remaining")}: {item.newLevel} L</Text>
          <Text style={styles.dateText}>
          {new Date(item.timestamp).toLocaleString()}
          </Text>
          </View>
        ))
      )}
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  barContainer: {
    height: 16,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  barLabel: { textAlign: "center", marginTop: 6, fontWeight: "600" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: { color: "white", marginLeft: 8 },
  historyItem: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  historyText: { fontSize: 14 },
  dateText: { fontSize: 12, color: "#777" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "red", textAlign: "center", fontSize: 16 },
  barside:{flex:1},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  tankName: { fontSize: 18, fontWeight: "bold" },
  editLink: { marginTop: 5, fontWeight: "600" },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 14,
    marginVertical: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  saveIcon: {
    paddingHorizontal: 8,
  },
});
