import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from "react-native";

import Products from "../../../components/ui/products";
import FarmInformation from "../../../components/ui/farmInformation";
import TopRightSection from "../../../components/ui/topRightSection";
import NavigationBottom from "../../../components/ui/navigationBottom";
import Barside from "../../../components/ui/barside";
import { useData } from "../../dataContext"

export default function Farm() {
  const {farms,selectedFarmId,setSelectedFarmId,products} = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadFarms = async () => {
    setLoading(true);
    try {
      console.log("📦 Chargement des fermes...");
    } catch (err) {
      console.error("❌ Erreur chargement fermes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);


 

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="green" />
        <Text>Chargement des fermes...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.loader}>
        <Text style={{ color: "red" }}>Erreur : {error}</Text>
      </View>
    );

  return (
    <View style={styles.barside}>
      <ScrollView style={styles.container}>
        {/* Section Header */}
        <View style={styles.section}>
          <FarmInformation/>
        </View>

        <View style={styles.main}>
          <NavigationBottom
            onFarmSelect={setSelectedFarmId}
            selectedFarmId={selectedFarmId}
            farms={farms}
          />
          <View style={styles.right}>
            {/*<TopRightSection />*/}
          </View>
        </View>

        {/* Section du bas */}
        <View style={styles.bottom}>
          <Products farmId={selectedFarmId} products={products}/>
        </View>
      </ScrollView>
      <Barside activeItem="/farmFolder" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  section: { padding: 10 },
  main: { flexDirection: "column", padding: 10, backgroundColor: "#f5f5f5" },
  right: { marginLeft: 5 },
  bottom: { marginTop: 10, padding: 10, backgroundColor: "#f9f9f9" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  barside:{flex: 1}
});
