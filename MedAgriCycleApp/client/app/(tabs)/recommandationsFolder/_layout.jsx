import { Stack } from "expo-router";

export default function RecsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,unmountOnBlur: true }} initialRouteName="recommandation">
      <Stack.Screen name="recommandation" />
    </Stack>
  );
}