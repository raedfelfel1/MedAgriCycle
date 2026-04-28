import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from "react-i18next";

export default function IconLabelButtons({ farmId }) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleClickAdd = () => {
 
  router.push({
    pathname: "/(tabs)/farmFolder/addProduct",
    params: { farmId }, 
  });
};

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleClickAdd}>
        <MaterialIcons name="add" size={20} color="white" style={styles.icon} />
        <Text style={styles.buttonText}>{t("addProduct")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 4,
    padding: 8,
  },
  button: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
