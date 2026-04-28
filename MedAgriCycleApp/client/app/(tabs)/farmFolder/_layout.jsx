import { Stack } from "expo-router";

export default function FarmsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,unmountOnBlur: true }} initialRouteName="farm"> 
      <Stack.Screen name="addFarm" />
      <Stack.Screen name="farm" />
      <Stack.Screen name="addProduct" />
      <Stack.Screen name="tankDashboard" />
    </Stack>
  );
}