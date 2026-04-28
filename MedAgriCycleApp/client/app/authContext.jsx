import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider ({ children }){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s’il y a un token enregistré au lancement
    const loadAuth = async () => {
      console.log("authContext")
      try {
        const existingToken = await AsyncStorage.getItem("token");
        const existingUserId = await AsyncStorage.getItem("userId");

        if (existingToken && existingUserId) {
          setToken(existingToken);
          setUser(existingUserId);
          console.log("existinguser : ",existingUserId)
        }
      } catch (err) {
        console.error("Erreur lors du chargement du token :", err);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  const login = async (tokenData, userData) => {
    try {
      await AsyncStorage.setItem("token", tokenData);
      await AsyncStorage.setItem("userId", userData.userId);
      setToken(tokenData);
      setUser(userData.userId);
      //const token = await AsyncStorage.getItem('token');
      //console.log("le token : ",token)
    } catch (err) {
      console.error("Erreur lors du login :", err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error("Erreur lors du logout :", err);
    }
  };

  const getAuthHeaders = async () => {
    try {
      const currentToken = await AsyncStorage.getItem("token");
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      };
    } catch (err) {
      console.error("Erreur récupération headers :", err);
      return { "Content-Type": "application/json" };
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
