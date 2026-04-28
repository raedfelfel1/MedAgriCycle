import React, { useState, useEffect } from 'react';
import "../contexts/styles/ProductInformation.css";
import ProductCard from '../components/ui/ProductCard';
import BarSide from '../components/ui/BarSide.js';
import SearchBar from '../components/ui/SearchBar.js';
import CategoryFilter from '../components/ui/CategoryFilter.js';
import { useData } from '../contexts/DataContext.js';
import { useTheme } from '../contexts/ThemeContext.js';
import { fetchFarmsByUser,getTankByUser } from '../services/api';

const ProductInformation = () => {
  const { products } = useData();
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState('');
  const [fertilizerTanks,setFertilizerTanks]=useState([]);
  const [waterTanks,setWaterTanks]=useState([]);
  const userId = localStorage.getItem('userId');
  // Charger les fermes de l'utilisateur
  useEffect(() => {
    if (!userId) return;

    const loadFarms = async () => {
      try {
        const userFarms = await fetchFarmsByUser(userId);
        setFarms(userFarms || []);
        if (userFarms && userFarms.length > 0) setSelectedFarm(userFarms[0]._id);
      } catch (err) {
        console.error("Erreur lors du chargement des fermes :", err);
      }
    };
    const loadTanks = async () =>{
      try {
        const userTanks = await getTankByUser(userId)
        if(userTanks){
          setWaterTanks(userTanks.filter(tank => tank.type === "water" || tank.type == "water_fertilizer"))
          setFertilizerTanks(userTanks.filter(tank => tank.type === "fertilizer" || tank.type == "water_fertilizer"))
        }
        else{
          console.error("Tanks param is not valid")
        }
      } catch (error) {
        console.error("Fail to fetch user tanks : ",error.message)
      }
    }
    loadTanks();
    loadFarms();
  }, [userId]);
  // Protection si produits pas encore chargés
  if (!products?.data) {
    return (
      <>
        <BarSide />
        <div className="chargement">Chargement des produits...</div>
      </>
    );
  }

  // Extraire les catégories uniques
  //const categories = [...new Set((products.data || []).map(p => p.category))];
  const categories = [...new Set(products.data.map(p => p.category))];
  // Filtrer les produits par recherche, catégorie et ferme sélectionnée
  const filteredProducts = (products.data || []).filter(produit => {
    const matchesSearch = produit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || produit.category === selectedCategory;
    const matchesFarm = selectedFarm === '' || produit.farm === selectedFarm;
    return matchesSearch && matchesCategory && matchesFarm;
  });
  return (
    <>
      <BarSide />
      <div className={`container ${darkMode ? 'dark' : ''}`}>
        <div className="filter">
          <SearchBar onSearch={setSearchTerm} />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Liste déroulante des fermes */}
          <select
            value={selectedFarm}
            onChange={e => setSelectedFarm(e.target.value)}
            className="farm-select"
          >
            {(farms || []).map(farm => (
              <option key={farm._id} value={farm._id}>
                {farm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="products">
          <ProductCard filteredProduct={filteredProducts} fertilizerTanks={fertilizerTanks} waterTanks={waterTanks}/>
        </div>
      </div>
    </>
  );
};

export default ProductInformation;

