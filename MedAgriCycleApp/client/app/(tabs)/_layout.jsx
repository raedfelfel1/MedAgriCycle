import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,unmountOnBlur: true }} initialRouteName="farmFolder"> 
      <Stack.Screen name="farmFolder" />
      <Stack.Screen name="recommandationsFolder" />
      <Stack.Screen name="settingsFolder" />
      <Stack.Screen name="productDetailsFolder" />
      <Stack.Screen name="userFolder" />
    </Stack>
  );
}
