import { View, Image, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

export default function HeaderEurope() {
  return (
    <SafeAreaView edges={["top"]}>
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,              
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff", 
  },
  image: {
    width: width * 0.3,      
    height: "100%",
  },
});
