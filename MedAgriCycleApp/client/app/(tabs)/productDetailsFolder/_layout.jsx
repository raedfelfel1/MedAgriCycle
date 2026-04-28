import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,unmountOnBlur: true }} initialRouteName="productDetails">
      <Stack.Screen name="productDetails" />
    </Stack>
  );
}