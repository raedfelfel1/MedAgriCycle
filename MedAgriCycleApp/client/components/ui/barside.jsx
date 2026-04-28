import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter,usePathname } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
export default function Barside({ activeItem }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const items = [
    { icon: <Ionicons name="person-outline" size={26} color="#4a8f2a" />, route: "/userFolder" },
    { icon: <Ionicons name="water-outline" size={26} color="#4a8f2a" />, route: "/tanksManagementFolder" },
    { icon: <MaterialIcons name="agriculture" size={26} color="#4a8f2a" />, route: "/farmFolder" },
    { icon: <MaterialIcons name="recommend" size={26} color="#4a8f2a" />, route: "/recommandationsFolder" },
    { icon: <MaterialIcons name="grass" size={26} color="#4a8f2a" />, route: "/productDetailsFolder" },
    { icon: <Ionicons name="settings-outline" size={26} color="#4a8f2a" />, route: "/settingsFolder" },
  ];

  return (
    <SafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        {items.map((item, index) => {
          const isActive = activeItem === item.route;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.iconWrapper, isActive && styles.active]}
              onPress={() => {
                if (pathname !== item.route) {
                  console.log("pathname : ",pathname)
                  router.replace(item.route); //possible d'utiliser .push mais cela duplique les useEffect et ralentit l'application
                }
              }}
            >
              {item.icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderColor: "#ddd",
    height: 56, // ⬅️ au lieu de 70
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 8,
  },
  active: {
    backgroundColor: "#e0e0e0",
  },
});
