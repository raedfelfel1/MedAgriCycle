import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  fetchProductsByFarm,
  createFarm,
  createProduct,
  updateFarm,
  updateProduct,
  deleteFarm,
  deleteProduct,
  fetchFarmsByUser,
} from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les données
  const loadData = useCallback(async () => {
    try {
      if (localStorage.getItem("userId")) {
        setLoading(true);
        const farmsData = await fetchFarmsByUser(localStorage.getItem("userId"));
        const productsData = await fetchProductsByFarm(farmsData[0]._id);
        setFarms(farmsData);
        setProducts(productsData);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [farms, products]);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  // Fonctions pour mettre à jour les données après ajout/modif/suppression
  const handleCreateFarm = async (farmData) => {
    await createFarm(farmData);
    await loadData();
  };

  const handleUpdateFarm = async (id, updates) => {
    await updateFarm(id, updates);
    await loadData();
  };

  const handleDeleteFarm = async (id) => {
    await deleteFarm(id);
    await loadData();
  };

  const handleCreateProduct = async (productData) => {
    await createProduct(productData);
    await loadData();
  };

  const handleUpdateProduct = async (id, updates) => {
    await updateProduct(id, updates);
    await loadData();
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    await loadData();
  };

  return (
    <DataContext.Provider value={{
      farms,
      products,
      loading,
      error,
      reloadData: loadData,
      createFarm: handleCreateFarm,
      updateFarm: handleUpdateFarm,
      deleteFarm: handleDeleteFarm,
      createProduct: handleCreateProduct,
      updateProduct: handleUpdateProduct,
      deleteProduct: handleDeleteProduct,
    }}>
      {children}
    </DataContext.Provider>
  );
};
