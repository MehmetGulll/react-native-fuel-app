import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title:'Akaryakıt Fiyatları',
          headerStyle: { backgroundColor: "#FFF5EE" },
          headerTintColor:'#000000'
        }}
      />
    </Stack>
  );
}
