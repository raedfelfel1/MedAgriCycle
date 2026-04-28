import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function UpdateButton() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        accessibilityLabel="update"
      >
        <MaterialIcons name="edit" size={24} color="black" />
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

