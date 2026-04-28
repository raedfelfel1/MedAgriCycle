import { useCallback , useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import IconLabelButtons from "./iconLabelButton";
import { useFocusEffect } from "@react-navigation/native";

import SearchBar from "./searchBar";
import CategoryFilter from "./categoryFilter";
import ProductCard from "./productCard";

export default function Products({ farmId,products }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [produits,setProduits] = useState([]);


  const loadProducts = async () => {
      try {
        if (!farmId) return;
        setLoading(true);

        const data = products.filter(product => product.farm === farmId);
        setProduits(data);

      } catch (err) {
        setError(err.message);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

 useFocusEffect(
  useCallback(() => {
    console.log("products");

    if (!farmId) return;

    loadProducts();

    return () => {
      console.log("products unfocused");
    };
  }, [farmId, products])
);

  const categories = [...new Set(produits.map((p) => p.category))];

  const filteredProduits = produits.filter((produit) => {
    const matchesSearch = produit.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || produit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <ActivityIndicator size="large" color="green" />;
  if (error) return <Text>{t("error")} : {error}</Text>;

  return (
    <View style={styles.container}>
      <SearchBar onSearch={setSearchTerm} />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <IconLabelButtons farmId={farmId} />
      <ProductCard
        filteredProduct={filteredProduits} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
});
