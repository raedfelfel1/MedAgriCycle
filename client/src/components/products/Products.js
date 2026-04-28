import React, { useState, useEffect } from 'react';
import '../../contexts/styles/Products.css';
import IconLabelButtons from '../ui/IconLabelButtons';
import DeleteProductButton from '../ui/DeleteProductButton';
import UpdateButton from '../ui/UpdateProductButton';
import ProductInformationButton from '../ui/ProductInformationButton';
import SearchBar from '../ui/SearchBar';
import { Typography } from '@mui/material';
import CategoryFilter from '../ui/CategoryFilter';
import { fetchProducts, fetchProductsByFarm } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Products = ({farmId}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleClick = () => {

    // Redirection vers la page d'information sur les produits au clic
    navigate('/informationsProduit');

  };

  ;

  const handleDeleteSuccess = (deletedProductId) => {
    setProduits(produits.filter(p => p._id !== deletedProductId));
  };


  //Récupération des produits une seule fois au chargement
  useEffect(() => {


    const loadProducts = async () => {
      //console.log(farmId);
      try {
        if(farmId){
          const data = await fetchProductsByFarm(farmId);
          //console.log(data);
          const productsArray = data.data;

          setProduits(productsArray);
          //console.log(productsArray);
        }
      } catch (err) {
        setError(err.message);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [farmId]);
  // Extraire les catégories uniques
  const categories = [...new Set(produits.map(p => p.category))];

  //Filtrer par nom
  // Filtrer les produits
  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || produit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductAdded = (newProduct) => {
    setProduits([...produits, newProduct]);
  };

  //Gestion de l'affichage lors du chargement

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <>
      <div className="global">
        <div className="en-tete">
          <div className="header-left">
            <Typography variant="h5" className="page-title">
              Gérer les produits
            </Typography>
          </div>
          <SearchBar onSearch={setSearchTerm} />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <IconLabelButtons />

        </div>

        <div>
          <div className="titre-tableau">
            <div className="titre_id">Id</div>
            <div className="titre_nom">Nom</div>
            {/*<div className="titre_ajout">Ajouté le</div>*/}
            <div className="titre_categorie">Catégorie</div>
            {/* <div className="titre_action">Action</div> */}
            <div className="titre_afficher">Fiche</div>

          </div>
          <div className="liste-produit">
            {filteredProduits.map(produit => (

              <React.Fragment key={produit.id}>
                <div className="id">{produit.id}</div>
                <div className={produit.name}>{produit.name}</div>
                {/*<div className="date">{produit.createdAt}</div>*/}
                <div className={produit.categorie}>{produit.category}</div>
                {/* <div className="action" style={{ display: "flex", flexDirection: "row" }}><UpdateButton /><DeleteProductButton product_id={produit._id} onDeleteSuccess={handleDeleteSuccess} /></div> */}
                <div className="afficher-fiche" onClick={handleClick}><ProductInformationButton /></div>


              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>

  )
}

export default Products;