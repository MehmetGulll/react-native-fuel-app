import React from 'react';
import { View, Text, Image } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const text = "Akaryakıt Fiyatları";
  const colors = ["#ffda00", "#0033A0", "#3E732B", "#0054A6", "#EF4135", "#DB0011"];

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

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
                {text.split("").map((char, index) => (
                  <Text key={index} style={{ color: getRandomColor(), marginRight: 5, fontSize:18 }}>
                    {char}
                  </Text>
                ))}
              </View>
              <Image
                source={require('../assets/images/fuelLogo.png')
                 
                }
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: "contain",
                  marginLeft: 38,
               
                  
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
