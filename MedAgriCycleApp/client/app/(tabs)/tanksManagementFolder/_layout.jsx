import { Stack } from "expo-router";

export default function TanksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,unmountOnBlur: true }} initialRouteName="tanksManagement">
      <Stack.Screen name="tanksManagement" />
      <Stack.Screen name="tankDetailDashboard" />
    </Stack>
  );
}