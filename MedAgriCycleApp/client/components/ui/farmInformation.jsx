import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useRef, useState,useMemo} from "react";
import { Alert,Animated,StyleSheet,Text,TextInput,View } from "react-native";
import { IconButton, Snackbar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import { useData } from "../../app/dataContext"; 

export default function FarmInformation() {
  const { t } = useTranslation();
  const { farms,deleteFarm, updateFarm,selectedFarmId} = useData(); 
  const [darkMode, setDarkMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...selectedFarm });
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    severity: "success",
  });
  const selectedFarm = useMemo(() => {
  return farms.find(f => f._id === selectedFarmId);
}, [farms, selectedFarmId]);
  
  // Animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
  useCallback(() => {
    if (!selectedFarm) return;
    console.log("selectedFarmId : ",selectedFarmId)
     setFormData(prev =>
      prev?._id === selectedFarm._id ? prev : { ...selectedFarm }
    );
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
    console.log("")
  }, [selectedFarmId]));

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setSnackbar({
        visible: true,
        message: "Le nom de la ferme est requis",
        severity: "error",
      });
      return;
    }

    try {
      await updateFarm(formData._id, formData.name);
      setEditMode(false);
      //onFarmUpdated?.({ ...farm, name: formData.name });

      setSnackbar({
        visible: true,
        message: "Nom de la ferme mis à jour ✅",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Erreur API:", error.message);
      setSnackbar({
        visible: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Supprimer la ferme",
      `Voulez-vous vraiment supprimer la ferme "${selectedFarm.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: handleDelete },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      // Animation de disparition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -40,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await deleteFarm(selectedFarm._id); 

        setSnackbar({
          visible: true,
          message: "Ferme supprimée 🗑️",
          severity: "success",
        });

        //onFarmDeleted?.(farm._id); // informer le parent
      });
    } catch (error) {
      console.error("❌ Erreur suppression :", error.message);
      setSnackbar({
        visible: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  if (!selectedFarm) {
    return (
      <View style={[styles.container, darkMode && styles.dark]}>
        <Text style={styles.emptyMessage}>Sélectionnez une ferme</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        darkMode && styles.dark,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: darkMode ? "#222" : "#fff",
        },
      ]}
    >
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.titleSection}>
          <MaterialIcons name="agriculture" size={28} color="#4CAF50" />
          <View>
            {editMode ? (
              <TextInput
                style={[styles.farmName, styles.input]}
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                placeholder="Nom de la ferme"
                autoFocus
              />
            ) : (
              <Text
                style={[styles.farmName, darkMode && { color: "#fff" }]}
                numberOfLines={1}
              >
                {formData.name}
              </Text>
            )}
            <Text style={[styles.farmId, darkMode && { color: "#aaa" }]}>
              #{formData._id}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <IconButton
            icon={() => (
              <MaterialIcons
                name={darkMode ? "wb-sunny" : "nightlight-round"}
                size={24}
                color={darkMode ? "#FFD54F" : "#555"}
              />
            )}
            onPress={toggleDarkMode}
          />

          {!editMode ? (
            <>
              <IconButton
                icon={() => (
                  <MaterialIcons name="edit" size={24} color="#2196F3" />
                )}
                onPress={() => setEditMode(true)}
              />
              <IconButton
                icon={() => (
                  <MaterialIcons name="delete-outline" size={24} color="#f44336" />
                )}
                onPress={confirmDelete}
              />
            </>
          ) : (
            <>
              <IconButton
                icon={() => (
                  <MaterialIcons name="save" size={24} color="#4CAF50" />
                )}
                onPress={handleSubmit}
              />
              <IconButton
                icon={() => (
                  <MaterialIcons name="cancel" size={24} color="#9E9E9E" />
                )}
                onPress={() => {
                  setEditMode(false);
                  setFormData({ ...selectedFarm });
                }}
              />
            </>
          )}
        </View>
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar((prev) => ({ ...prev, visible: false }))
        }
        duration={3000}
        style={{
          backgroundColor:
            snackbar.severity === "error" ? "#f44336" : "#4CAF50",
        }}
      >
        {snackbar.message}
      </Snackbar>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  dark: {
    backgroundColor: "#333",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  farmName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    maxWidth: 180,
  },
  farmId: {
    fontSize: 14,
    color: "#777",
  },
  actions: {
    flexDirection: "row",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    minWidth: 150,
    paddingVertical: 2,
    color: "#000",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
});
