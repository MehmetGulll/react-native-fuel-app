import React from "react";
import { Stack } from "expo-router";
import { Image, View, Text } from "react-native";

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
              <Text style={{ marginLeft: 10 }}>Akaryakıt Fiyatları</Text>
              <Image
                source={{
                  uri: "https://t4.ftcdn.net/jpg/04/53/22/29/360_F_453222994_qtL8s7Ti8JEQ9FDoWGrgvlG2XRKtfFhE.jpg",
                }}
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: "contain",
                  marginLeft: 180,
                  backgroundColor: "#FFF5EE",
                }}
              />
            </View>
          ),
          headerStyle: { backgroundColor: "#FFF5EE" },
          headerTintColor: "#000000",
        }}
      />
    </Stack>
  );
}
