import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

const Index = () => {
  type City= {
    name: string;

  }
  type Item = {
    label:string;
    value:string

  }
  const [cities, setCities] = useState<Item[]>([]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_CITIES_API_HOST}`);
     
        const cityItems = response.data.data.map((city: City) => ({
          label: city.name,
          value: city.name,
        }));
        setCities(cityItems); 
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchCities();
  },[]);
  return (
    <ScrollView>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 15,
          marginTop: 10,
          marginHorizontal: 32,
        }}
      >
        <RNPickerSelect
          onValueChange={(value) => console.log(value)}
          items={cities}
        />
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 10,
          marginTop: 10,
          marginHorizontal: 5,
        }}
      >
        <Image
          source={{
            uri: "https://www.ttsbasvuru.com/wp-content/uploads/2021/04/shell.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <Image
          source={{
            uri: "https://melihpetrol.com/resim/upload/252.png",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <Image
          source={{
            uri: "https://10haber.net/wp-content/uploads/2023/11/BP-Turkiye-1024x601.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <Image
          source={{
            uri: "https://kadoil.com/wp-content/uploads/2021/02/kadoil-duzce-istasyonlari.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <Image
          source={{
            uri: "https://www.dir.gen.tr/image/229651-0-eskicirak-petrol-alpet.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <Image
          source={{
            uri: "https://fastly.4sqi.net/img/general/600x600/527974929_LXu4elC5vuFouGtg82p9K57LFLo_1OwszpzZM72sdds.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
      </View>
    </ScrollView>
  );
};
export default Index;
