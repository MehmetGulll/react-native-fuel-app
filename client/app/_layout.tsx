import React from "react";
import { View, Image } from "react-native";
import { Text } from "react-native-paper";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", marginLeft: 18 }}>
              <Text variant="headlineSmall">Akaryakıt Fiyatları</Text>
              </View>
              <View style={{ padding: 5 }}>
                <Image
                  source={require("../assets/images/fuelLogo.png")}
                  style={{
                    width: 70,
                    height: 70,
                    resizeMode: "contain",
                    marginLeft: 38,
                  }}
                />
              </View>
            </View>
          ),
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
