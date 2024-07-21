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
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row" }}></View>
              <View style={{ padding: 5, marginLeft:150 }}>
                <Image
                  source={require("../assets/images/fuelLogo.png")}
                  style={{
                    width: 50,
                    height: 50,
                    resizeMode: "contain",
                  }}
                />
              </View>
            </View>
          ),
          headerStyle: { backgroundColor: "#b2cbf2" },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
