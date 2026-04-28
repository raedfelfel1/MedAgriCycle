import { MaterialIcons } from '@expo/vector-icons';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { deleteProduct } from '../../services/api';

export default function DeleteButton({ product_id, onDeleteSuccess }) {
  const productId = product_id;

  const handleDeleteProduct = async () => {
    try {
      // Afficher une confirmation avant la suppression
      Alert.alert(
        "Confirmer la suppression",
        "Êtes-vous sûr de vouloir supprimer ce produit ?",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Supprimer",
            onPress: async () => {
              try {
                await deleteProduct(productId);
                console.log('Produit supprimé avec succès');
                // Afficher une alerte de succès
                Alert.alert("Succès", "Produit supprimé avec succès");
                onDeleteSuccess(product_id); // Appeler le callback
              } catch (error) {
                console.error('Erreur:', error.message);
                // Afficher une alerte d'erreur
                Alert.alert("Erreur", error.message || 'Erreur lors de la suppression du produit');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erreur:', error.message);
      Alert.alert("Erreur", error.message || 'Erreur inattendue');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleDeleteProduct}
        accessibilityLabel="delete"
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    margin: 4,
  },
});
