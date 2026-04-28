import { useEffect, useState } from "react";
import {Image,ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

import Barside from "../../../components/ui/barside";
import { fetchUserById, updateUser } from "../../../services/api";
import {useAuth} from "../../authContext"

export default function User (){
  const { t } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "", severity: "success" });
  const { user, loading } = useAuth();
  console.log("userid:",user)
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    address: "",
    email: "",
    phone: "",
    location: "",
    createdAt: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    if (!user || loading || !isMounted) return; 

    try {
      const userData = await fetchUserById(user);
      if (!isMounted) return;
      setFormData({
        id: user || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        age: userData.age?.toString() || "",
        address: userData.address || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        createdAt: userData.createdAt || new Date().toISOString(),
      });
    } catch (err) {
      if (isMounted)
        setSnackbar({
          visible: true,
          message: "Erreur lors du chargement de l'utilisateur",
          severity: "error",
        });
    }
  };

  loadData();

  return () => {
    isMounted = false;
  };
}, [user, loading]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmClick = async () => {
    try {
      const updated = await updateUser(user, formData);

      setFormData(updated);
      setIsEditable(false);
      setSnackbar({ visible: true, message: t("successModification"), severity: "success" });
    } catch (err) {
      setSnackbar({ visible: true, message: t("errorModification"), severity: "error" });
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.dark]}>
  <View style={styles.barSide}>
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.mainContent}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Icon name="person" size={80} color="#50AC54" />
          )}
        </TouchableOpacity>

        <View>
          <Text style={styles.name}>
            {formData.lastName} {formData.firstName}
          </Text>
          <Text style={styles.subText}>
            {t("memberSince")} {new Date(formData.createdAt).toLocaleDateString(t("localDate"))}
          </Text>
        </View>
      </View>
          <View style={styles.actions}>
          {/*<Switch value={darkMode} onValueChange={setDarkMode} />*/}
          {!isEditable ? (
            <Button mode="contained" onPress={() => setIsEditable(true)} style={styles.actionBtn}>
              {t("modify")}
            </Button>
          ) : (
            <Button mode="contained" onPress={handleConfirmClick} style={styles.actionBtn}>
              {t("confirm")}
            </Button>
          )}
        </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("basicInfos")}</Text>
          
        <TextInput
          label={t("lastName")}
          value={formData.lastName}
          onChangeText={(val) => handleInputChange("lastName", val)}
          editable={isEditable}
          style={styles.input}
        />

        <TextInput
          label={t("firstName")}
          value={formData.firstName}
          onChangeText={(val) => handleInputChange("firstName", val)}
          editable={isEditable}
          style={styles.input}
          
        />

        <TextInput
          label={t("age")}
          value={formData.age}
          onChangeText={(val) => handleInputChange("age", val)}
          editable={isEditable}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label={t("address")}
          value={formData.address}
          onChangeText={(val) => handleInputChange("address", val)}
          editable={isEditable}
          style={styles.input}
        />

        <TextInput label="ID" value={formData.id} editable={false} style={styles.input} />
      </View>

      {/* Section Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("contactInfo")}</Text>

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(val) => handleInputChange("email", val)}
          editable={isEditable}
          style={styles.input}
        />

        <TextInput
          label={t("phone")}
          value={formData.phone}
          onChangeText={(val) => handleInputChange("phone", val)}
          editable={isEditable}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label={t("location")}
          value={formData.location}
          onChangeText={(val) => handleInputChange("location", val)}
          editable={isEditable}
          style={styles.input}
        />
      </View>
    </ScrollView>
    <Barside activeItem="/userFolder" />
  </View>

  {/* Snackbar */}
  <Snackbar
    visible={snackbar.visible}
    onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
    duration={3000}
  >
    {snackbar.message}
  </Snackbar>
</View>

  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  barSide: {flex: 1},
  dark: { backgroundColor: "#E4F4EC" },
  scrollContent: { padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20, justifyContent: "space-between" },
  avatar: { marginRight: 16 },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 20, fontWeight: "bold" },
  subText: { color: "black" },
  actions: {
  flexDirection: "row",       
  justifyContent: "center",  
  alignItems: "center",
  marginVertical: 16,         
  gap: 10,                    
},
  actionBtn: { marginTop: 8,backgroundColor:"#50AC54" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  input: { marginBottom: 12, backgroundColor: "#E4F4EC" },
});
