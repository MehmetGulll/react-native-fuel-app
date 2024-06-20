import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

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
  const [bpPrice,setBpPrice] = useState("");
  const [kadoilPrice, setKadoiPrice] = useState("");
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

  const handleCitySelect = async(selectedCity:string) =>{
    console.log("seçilen şehir",selectedCity);
    let lowerCity = selectedCity.toLocaleLowerCase('tr-TR');
   
    try {
      if(lowerCity === 'ığdır'){
        lowerCity ='igdir'
      }
      if(lowerCity === 'istanbul'){
        lowerCity = 'istanbul-avrupa'
      }
      const opetResponse = await axios.post(`${process.env.EXPO_PUBLIC_OPET_HOST}`,{
        city: lowerCity
      })
     
      console.log("opet verileri",opetResponse.data);
      
      setOpetPrice(opetResponse.data);
    } catch (error) {
      console.log("Error",error);
    }
    try {
      if(lowerCity === 'istanbul-avrupa'){
        lowerCity = "istanbul (avrupa)"
      }
      const BPResponse = await axios.post(`${process.env.EXPO_PUBLIC_BP_HOST}`,{
        city: lowerCity
      })
      console.log("BP verileri",BPResponse.data);
      setBpPrice(BPResponse.data);
    } catch (error) {
      console.log("Error",error);
    }
  }
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
          onValueChange={handleCitySelect}
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
          {opetPrice.length > 0 &&(
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
          <Text>Opet</Text>
          {opetPrice.length > 0 &&(
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
      </View>
    </ScrollView>
  );
};
export default Index;
