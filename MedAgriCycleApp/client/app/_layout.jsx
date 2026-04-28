import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

import AuthProvider from './authContext'; 
import DataProvider from './dataContext';
import HeaderEurope from "../components/ui/headerEurope"
//import notificationService from '../services/notificationService';
 /*useEffect(() => {
    // Initialiser les notifications au démarrage de l'app
    notificationService.initialize();
    
    // Nettoyer les listeners à la fermeture
    return () => {
      notificationService.cleanup();
    };
  }, []);*/

export default function RootLayout() {
  return (
    <AuthProvider>
      <DataProvider>
        <View style={styles.container}>
          {/* Header global */}
          <HeaderEurope />

          {/* Navigation */}
          <Stack
            initialRouteName="connexion"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="connexion" />
            <Stack.Screen name="inscription" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </DataProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

