import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  createFarm, createProduct, deleteFarm, deleteProduct, updateFarm, updateProduct,
  createTank, fetchTanks, deleteTank, updateTank,fetchFarmsAndProductsByUser,fetchRecommendations,fetchEveryTanksLastLevel,
  createTankHistory,fetchSensorHistory,updateTankName
} from "../services/api";
import {useAuth} from "./authContext"

// Contient toutes les données nécessaires aux pages/composants
const DataContext = createContext();
export const useData = () => useContext(DataContext);

export default function DataProvider({ children }){
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tanks, setTanks] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [version, setVersion] = useState(0);
  const [recs,setRecommendations] = useState([]);
  const [recommendationsFetchedAt, setRecommendationsFetchedAt] = useState(null);
  const [tanksLastLevel,setTanksLastLevel]=useState([]);
  const [chartCache, setChartCache] = useState({});

  
  const {user} = useAuth()
  const RECOMMENDATIONS_TTL = 30 * 60 * 1000;

  const makeChartKey = (sensorId, hours) => `${sensorId}_${hours}`;
  const loadTanks = useCallback(async () => {
    try {
      const tanksData = await fetchTanks();
      setTanks(tanksData);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadFarmsAndProducts = useCallback(async () => {
    try {
      if (!user) return;
      const userData = await fetchFarmsAndProductsByUser(user);
      setFarms(userData.farms);
      setProducts(userData.products);
    } catch (err) {
      if (!err.isNgrokError) {
      setError(err.message);
    }
    }
  }, [user]);

  const loadRecommendations = useCallback(async () => {
    try {
      const now = Date.now();

      if (
        recommendationsFetchedAt && now - recommendationsFetchedAt < RECOMMENDATIONS_TTL
      ) {
        console.log("✅ recommandations déjà à jour (cache)");
        return;
      }
      const recs = await fetchRecommendations(user);

      setRecommendations(recs);
      setRecommendationsFetchedAt(now);
    } catch (err) {
      if (!err.isNgrokError) {
      setError(err.message);
    }
    }
  }, [user, recommendationsFetchedAt]);

  const loadTanksQuantity = useCallback(async () => {
    try {
      if(!user) return;
      const lastLevel = await fetchEveryTanksLastLevel(user);
      console.log("LAST LEVEL :",lastLevel)
      setTanksLastLevel(lastLevel);
    } catch (err) {
      if (!err.isNgrokError) {
      setError(err.message);
    }
    }
  }, [user]);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("APPELLE ALL")
      await Promise.all([
        loadTanks(),
        loadFarmsAndProducts(),
        loadTanksQuantity(),
        loadRecommendations(),
      ]);
    } catch (err) {
      if (!err.isNgrokError) {
        Alert.alert("Erreur", err.message || "Impossible de charger les données.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log("dataContext",user)
    if(user){
      console.log("uservalue : ",user)
      loadAllData();
    }
  }, [user]);

  // Fonctions pour mettre à jour les données après ajout/modif/suppression
  const handleCreateFarm = async (farmData) => {
  try {
    const newFarm = await createFarm(farmData); // récupère la ferme créée
    await loadFarmsAndProducts();
    setVersion(v => v + 1);
    return newFarm;
  } catch (err) {
    Alert.alert("Erreur", err.message || "Impossible de créer la ferme.");
  }
};

  const handleUpdateFarm = async (id, updates) => {
    try {
      await updateFarm(id, updates);
      await loadFarmsAndProducts();
      setVersion(v => v + 1);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de mettre à jour la ferme.");
    }
  };

  const handleDeleteFarm = async (id) => {
    try {
      await deleteFarm(id);
      if(farms.length>1){
        setSelectedFarmId(farms[0]._id);
      }
      await loadFarmsAndProducts();
      setVersion(v => v + 1);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de supprimer la ferme.");
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      await loadFarmsAndProducts();
      setVersion(v => v + 1);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de créer le produit.");
    }
  };

  const handleUpdateProduct = async (id, updates) => {
    try {
      await updateProduct(id, updates);
      await loadFarmsAndProducts();
      setVersion(v => v + 1);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de mettre à jour le produit.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      await loadFarmsAndProducts();
      setVersion(v => v + 1);
    } catch (err) {
      Alert.alert("Erreur", err.message || "Impossible de supprimer le produit.");
    }
  };

  const handleCreateTank = async (tankData) => { 
    try{
      await createTank(tankData); 
      await loadTanks();
      setVersion(v => v + 1);
    } catch(err){
      Alert.alert("Erreur", err.message || "Impossible de créer le tank.");
    }
  };

  const handleUpdateTank = async (id, updates) => { 
    try {
      await updateTank(id, updates); 
      await loadTanks();
      setVersion(v => v + 1);
    }catch(err){
      Alert.alert("Erreur", err.message || "Impossible d'update le tank.");
    }
  };

  const handleDeleteTank = async (id) => { 
    try{
      await deleteTank(id);
      await loadTanks();
      setVersion(v => v + 1);
    }catch(err){
      Alert.alert("Erreur", err.message || "Impossible de supprimer le tank.");
    }
  };

  const handleUpdateTankName = async (id,newName) => { 
    try{
      await updateTankName(id,newName)
      await loadTanks();
      setVersion(v => v + 1);
    }catch(err){
      Alert.alert("Erreur", err.message || "Impossible de renommer le tank.");
    }
  };

  const handleCreateTankHistory = async (tankId, productId, quantity, newLevel, actionType) => {
    try {
      if (!tankId || !productId) return;

      await createTankHistory(
        tankId,
        productId,
        quantity,
        newLevel,
        actionType
      );
      loadTanksQuantity();
      setVersion(v => v + 1);

    } catch (err) {
      console.error("Erreur handleCreateTankHistory :", err);
      throw err;
    }
  }

  const getChartData = useCallback(async (sensorId, hours) => {
  try {
    const key = makeChartKey(sensorId, hours);
    const now = new Date();

    const cached = chartCache[key];

    if (cached) {
      const cachedSlice = getTimeSlice(cached.computedAt, hours);
      const currentSlice = getTimeSlice(now, hours);

      if (cachedSlice === currentSlice) {
        console.log("CHART CACHE DEJA EXISTANT", key);
        console.log("cahced data : ",cached.data)
        return cached.data;
      }
    }

    console.log("chart cache manquant", key);

    const raw = await fetchSensorHistory(sensorId, hours);

    const sorted = raw
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(d => ({
        timestamp: new Date(d.timestamp),
        temperature: d.temperature ?? 0,
        humidity: d.humidity ?? 0,
        //ajouter le ph, mais il n'existe pas dans les datas récupérées
        ph:d.ph ??0,
        conductivity:d.conductivity??0,
      }));

    setChartCache(prev => ({
      ...prev,
      [key]: {
        data: sorted,
        computedAt: now,
      },
    }));

    return sorted;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de getChartData :", error);
    return [];
  }
}, [chartCache]);



  const getTimeSlice = (date, hours) => {
  const d = new Date(date);

  if (hours <= 24) {
    // tranche horaire
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  }

  if (hours <= 168) {
    // tranche demi-journée
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours() < 12 ? "AM" : "PM"}`;
  }

  // tranche journalière
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

  return (
    <DataContext.Provider
      value={{
        selectedFarmId,
        setSelectedFarmId,
        farms,
        products,
        tanks,
        loading,
        error,
        version,
        recs,
        tanksLastLevel,
        reloadData: loadAllData,
        createFarm: handleCreateFarm,
        updateFarm: handleUpdateFarm,
        deleteFarm: handleDeleteFarm,
        createProduct: handleCreateProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        createTank: handleCreateTank,
        updateTank: handleUpdateTank,
        deleteTank: handleDeleteTank,
        handleUpdateTankName,
        createTankHistory: handleCreateTankHistory,
        getChartData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
