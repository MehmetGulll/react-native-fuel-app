import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Index = () => {
  type City = {
    name: string;
  };
  type Item = {
    label: string;
    value: string;
  };
  const [cities, setCities] = useState<Item[]>([]);
  const [opetPrice, setOpetPrice] = useState("");
  const [bpPrice, setBpPrice] = useState("");
  const [kadoilPrice, setKadoiPrice] = useState("");
  const [alpetPrice, setAlpetPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [aytemizPrice, setAytemizPrice] = useState("");
  const [petroOfisiPrice, setPetrolOfisiPrice] = useState("");
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_CITIES_API_HOST}`
        );

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
  }, []);

  const handleCitySelect = async (selectedCity: string) => {
    console.log("seçilen şehir", selectedCity);
    let lowerCity = selectedCity.toLocaleLowerCase("tr-TR");

    try {
      if (lowerCity === "ığdır") {
        lowerCity = "igdir";
      }
      if (lowerCity === "istanbul") {
        lowerCity = "istanbul-avrupa";
      }
      const opetResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_OPET_HOST}`,
        {
          city: lowerCity,
        }
      );

      console.log("opet verileri", opetResponse.data);

      setOpetPrice(opetResponse.data);
    } catch (error) {
      console.log("Error", error);
    }
    try {
      if (lowerCity === "istanbul-avrupa") {
        lowerCity = "istanbul (avrupa)";
      }
      if (lowerCity === "igdir") {
        setBpPrice("Petrol ofisi bulunmamaktadır");
      } else {
        const BPResponse = await axios.post(
          `${process.env.EXPO_PUBLIC_BP_HOST}`,
          {
            city: lowerCity,
          }
        );
        if (!BPResponse.data) {
          console.log("Veri yok");
          setBpPrice("Petrol ofisi bulunmamaktadır!!");
        } else {
          console.log(BPResponse.data);
          setBpPrice(BPResponse.data);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      const kadoilResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_KADOIL_HOST}`,
        {
          city: lowerCity,
        }
      );
      if (kadoilResponse.data) {
        console.log(kadoilResponse.data);
        setKadoiPrice(kadoilResponse.data);
      } else {
        console.log("Veri yok");
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      const alpetPrice = await axios.post(
        `${process.env.EXPO_PUBLIC_ALPET_HOST}`,
        { city: lowerCity }
      );
      if (alpetPrice.data) {
        console.log("alpet verileri", alpetPrice.data);
        setAlpetPrice(alpetPrice.data);
      } else {
        console.log("Petrol ofisi bulunmamaktadır!.");
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      const totalPrice = await axios.post(
        `${process.env.EXPO_PUBLIC_TOTAL_HOST}`,
        {
          city: lowerCity,
        }
      );
      if (totalPrice) {
        console.log("total verileri", totalPrice.data);
        setTotalPrice(totalPrice.data);
      } else {
        console.log("Veri yok");
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      const aytemizResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_AYTEMIZ_HOST}`,
        { city: lowerCity }
      );
      if (aytemizResponse) {
        console.log("aytemiz verileri", aytemizResponse.data);
        setAytemizPrice(aytemizResponse.data);
      } else {
        console.log("Veri yok");
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      console.log(lowerCity);
      const petrolOfisiResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_PETROLOFISI_HOST}`,
        { city: lowerCity }
      );
      if(petrolOfisiResponse.data){
        setPetrolOfisiPrice(petrolOfisiResponse.data);
        console.log("petrol ofisi verileri:",petrolOfisiResponse.data);
      }
      
    } catch (error) {
      console.log("Error", error);
    }
  };
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
        <RNPickerSelect onValueChange={handleCitySelect} items={cities} />
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
        <View>
          <Text>Shell</Text>
        </View>
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
        <View>
          <Text>Opet</Text>
          {opetPrice.length > 0 && (
            <View>
              <Text>Benzin:{opetPrice[0]} </Text>
              <Text>Motorin:{opetPrice[1]}</Text>
              <Text>Otogaz:{opetPrice[2]}</Text>
            </View>
          )}
        </View>
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
        <View>
          <Text>BP</Text>
          {bpPrice.length > 0 && (
            <View>
              <Text>Benzin:{bpPrice[0][2]} </Text>
              <Text>Motorin:{bpPrice[0][3]}</Text>
              <Text>Otogaz:{bpPrice[0][10]}</Text>
            </View>
          )}
        </View>
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
        <View>
          <Text>Kadoil</Text>
          {kadoilPrice.length > 0 && (
            <View>
              <Text>Benzin:{kadoilPrice[1]} </Text>
              <Text>Motorin:{kadoilPrice[2]}</Text>
            </View>
          )}
        </View>
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
        <View>
          <Text>Alpet</Text>
          {alpetPrice.length > 0 && (
            <View>
              <Text>Benzin:{alpetPrice[0][2]} </Text>
              <Text>Motorin:{alpetPrice[0][4]}</Text>
            </View>
          )}
        </View>
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
        <View>
          <Text>Total</Text>
          {totalPrice.length > 0 && (
            <View>
              <Text>Benzin:{totalPrice[0]} </Text>
              <Text>Motorin:{totalPrice[2]}</Text>
            </View>
          )}
        </View>
        <Image
          source={{
            uri: "https://cdnuploads.aa.com.tr/uploads/sirkethaberleri/Contents/2019/12/05/thumbs_b_c_0b2c7d09a483922cb8fb9d9c25cfa3c7.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <View>
          <Text>Aytemiz</Text>
          {aytemizPrice.length > 0 && (
            <View>
              <Text>Benzin:{aytemizPrice[0]} </Text>
              <Text>Motorin:{aytemizPrice[1]}</Text>
            </View>
          )}
        </View>
        <Image
          source={{
            uri: "https://i.dunya.com/storage/files/images/2021/09/21/petrol-ofisi-bV0P_cover.jpg",
          }}
          style={{
            width: "100%",
            height: 250,
            resizeMode: "stretch",
            borderRadius: 15,
          }}
        />
        <View>
          <Text>Petrol Ofisi</Text>
          {aytemizPrice.length > 0 && (
            <View>
              <Text>Benzin:{petroOfisiPrice[0]} </Text>
              <Text>Motorin:{petroOfisiPrice[1]}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default Index;
