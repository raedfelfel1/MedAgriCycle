import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import "../i18n";
import { useAuth } from "./authContext";

export default function Connexion() {
  const [login, setLogin] = useState("test.test@test.com");
  const [password, setPassword] = useState("Test123456789!*");
  const [showPassword, setShowPassword] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { API_IP } = Constants.expoConfig.extra;
  const API_URL = `${API_IP}`;
  
  const { t } = useTranslation();

  console.log("api recu : ",API_URL)
  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ login, password }),
      });
      
      // Vérifier le Content-Type avant de parser
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (jsonError) {
          const text = await response.text();
          console.error("Erreur parsing JSON, réponse reçue:", text);
          
          // Vérifier si c'est une erreur ngrok
          if (text.includes("ngrok") || text.includes("offline") || text.includes("ERR_NGROK")) {
            alert("⚠️ Le serveur est actuellement hors ligne.\n\nVérifiez que le tunnel ngrok est actif et que le serveur est démarré.");
          } else {
            alert("Erreur : Le serveur a renvoyé une réponse invalide.");
          }
          return;
        }
      } else {
        // Si ce n'est pas du JSON, lire le texte
        const text = await response.text();
        console.error("Réponse non-JSON reçue:", text);
        
        // Vérifier si c'est une erreur ngrok
        if (text.includes("ngrok") || text.includes("offline") || text.includes("ERR_NGROK")) {
          alert("⚠️ Le serveur est actuellement hors ligne.\n\nVérifiez que le tunnel ngrok est actif et que le serveur est démarré.");
        } else {
          alert("Erreur : Réponse serveur invalide.");
        }
        return;
      }
      
      if (response.ok) {
        console.log("Connexion réussie :", data.user);
        authLogin(data.token, data.user);
        
        setTimeout(() => {
          router.replace("/(tabs)/productDetailsFolder");
        }, 1000);
      } else {
        alert(data.message || "Échec de la connexion.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      
      // Vérifier si c'est une erreur de connexion réseau
      if (error.message && (error.message.includes("Network") || error.message.includes("fetch"))) {
        alert("⚠️ Impossible de se connecter au serveur.\n\nVérifiez que :\n• Le serveur est démarré\n• Le tunnel ngrok est actif\n• Votre connexion internet fonctionne");
      } else if (error.message && (error.message.includes("ngrok") || error.message.includes("offline"))) {
        alert("⚠️ Le serveur est actuellement hors ligne.\n\nVérifiez que le tunnel ngrok est actif et que le serveur est démarré.");
      } else {
        alert("Erreur réseau : " + (error.message || "Impossible de se connecter au serveur."));
      }
    }
  };
  
  return (

      <View style={styles.container}>
        <Icon name="lock" size={40} color="black" />
        <Text style={styles.title}>{t("login")}</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={login}
          onChangeText={setLogin}
        />

        <TextInput
          placeholder={t("password")}
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text>{showPassword ? t("hide") : t("show")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t("login")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/inscription")}>
          <Text style={{ color: "blue" }}>{t("createAccount")}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    transform: [{ translateY: -50 }], 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

