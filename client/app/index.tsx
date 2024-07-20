import React, { useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import {
  Card,
  Text,
  ActivityIndicator,
  MD2Colors,
} from "react-native-paper";
import styles from "./indexStyle";
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
  const [bpPrice, setBpPrice] = useState("");
  const [kadoilPrice, setKadoiPrice] = useState("");
  const [alpetPrice, setAlpetPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [aytemizPrice, setAytemizPrice] = useState("");
  const [petrolOfisiPrice, setPetrolOfisiPrice] = useState("");
  const [shellPrice, setShellPrice] = useState("");
  const [shellBenzinPrice, setShellBenzinPrice] = useState("");
  const [shellDizelPrice, setShellDizelPrice] = useState("");
  const [loadingOpet, setLoadingOpet] = useState(false);
  const [loadingBp, setLoadingBp] = useState(false);
  const [loadingKadoil, setLoadingKadoil] = useState(false);
  const [loadingAlpet, setLoadingAlpet] = useState(false);
  const [loadingTotal, setLoadingTotal] = useState(false);
  const [loadingAytemiz, setLoadingAytemiz] = useState(false);
  const [loadingPetrolOfisi, setLoadingPetrolOfisi] = useState(false);
  const [loadingShell, setLoadingShell] = useState(false);
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

  const fetchOpetData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setOpetPrice("");
    setLoadingOpet(true);
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
    } finally {
      setLoadingOpet(false);
    }
  };

  const fetchBPData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setBpPrice("");
    setLoadingBp(true);
    try {
      if (lowerCity === "istanbul") {
        lowerCity = "istanbul (avrupa)";
      }
      if (lowerCity === "ığdır") {
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
    } finally {
      setLoadingBp(false);
    }
  };
  const fetchKadoilData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setKadoiPrice("");
    setLoadingKadoil(true);
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
    } finally {
      setLoadingKadoil(false);
    }
  };
  const fetchAlpetData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setAlpetPrice("");
    setLoadingAlpet(true);
    try {
      const alpetPrice = await axios.post(
        `${process.env.EXPO_PUBLIC_ALPET_HOST}`,
        { city: lowerCity }
      );
      if (alpetPrice.data) {
        console.log("alpet verileri", alpetPrice.data[0]);
        setAlpetPrice(alpetPrice.data);
      } else {
        console.log("Petrol ofisi bulunmamaktadır!.");
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingAlpet(false);
    }
  };
  const fetchTotalData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setTotalPrice("");
    setLoadingTotal(true);
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
    } finally {
      setLoadingTotal(false);
    }
  };
  const fetchAytemizData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setAytemizPrice("");
    setLoadingAytemiz(true);
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
    } finally {
      setLoadingAytemiz(false);
    }
  };
  const fetchPetrolofisiData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setPetrolOfisiPrice("");
    setLoadingPetrolOfisi(true);
    try {
      console.log(lowerCity);
      const petrolOfisiResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_PETROLOFISI_HOST}`,
        { city: lowerCity }
      );
      if (petrolOfisiResponse.data) {
        setPetrolOfisiPrice(petrolOfisiResponse.data);
        console.log("petrol ofisi verileri:", petrolOfisiResponse.data);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingPetrolOfisi(false);
    }
  };
  const fetchShellData = async (city: string) => {
    let lowerCity = city.toLocaleLowerCase("tr-TR");
    setShellPrice("");
    setShellBenzinPrice("");
    setShellDizelPrice("");
    setLoadingShell(true);
    if (lowerCity === "ığdır") {
      lowerCity = "ıgdır";
    }
    try {
      const shellResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_SHELL_HOST}`,
        {
          city: lowerCity,
        }
      );
      if (shellResponse.data && Array.isArray(shellResponse.data.data)) {
        const data = shellResponse.data.data;
        setShellPrice(data);
        console.log("shell verileri", data);

        const merkezData = data.find(
          (item: { cityName: string }) => item.cityName === "MERKEZ"
        );

        if (merkezData) {
          setShellBenzinPrice(merkezData.price1);
          setShellDizelPrice(merkezData.price2);
        }
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoadingShell(false);
    }
  };

  const handleCitySelect = async (selectedCity: string) => {
    console.log("seçilen şehir", selectedCity);
    try {
      const [
        opetPrice,
        bpPrice,
        kadoilPrice,
        alpetPrice,
        totalPrice,
        aytemizPrice,
        petrolOfisiPrice,
        shellPrice,
      ] = await Promise.all([
        fetchOpetData(selectedCity),
        fetchBPData(selectedCity),
        fetchKadoilData(selectedCity),
        fetchAlpetData(selectedCity),
        fetchTotalData(selectedCity),
        fetchAytemizData(selectedCity),
        fetchPetrolofisiData(selectedCity),
        fetchShellData(selectedCity),
      ]);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <ScrollView>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text>Fiyatlar ortalamadır değişiklik gösterebilir.</Text>
      </View>
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
          placeholder={{ label: "Şehir seçiniz...", value: null }}
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
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Shell</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://www.ttsbasvuru.com/wp-content/uploads/2021/04/shell.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center'}}>
                <Text variant="bodyLarge">Motorin: {shellDizelPrice}₺</Text>
                <Text variant="bodyLarge">Benzin: {shellBenzinPrice}₺</Text>
              </View>
            ) : (
              <Text variant="bodyLarge">.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Opet</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{ uri: "https://melihpetrol.com/resim/upload/252.png" }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10,alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {opetPrice[1]}₺</Text>
                <Text variant="bodyLarge">Benzin: {opetPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">BP</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://10haber.net/wp-content/uploads/2023/11/BP-Turkiye-1024x601.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {bpPrice[0][3]}₺</Text>
                <Text variant="bodyLarge">Benzin: {bpPrice[0][2]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Kadoil</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://kadoil.com/wp-content/uploads/2021/02/kadoil-duzce-istasyonlari.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {kadoilPrice[2]}₺</Text>
                <Text variant="bodyLarge">Benzin: {kadoilPrice[1]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Alpet</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://www.dir.gen.tr/image/229651-0-eskicirak-petrol-alpet.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {alpetPrice[1][0]}₺</Text>
                <Text variant="bodyLarge">Benzin: {alpetPrice[0][0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Total</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://fastly.4sqi.net/img/general/600x600/527974929_LXu4elC5vuFouGtg82p9K57LFLo_1OwszpzZM72sdds.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {totalPrice[2]}₺</Text>
                <Text variant="bodyLarge">Benzin: {totalPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleLarge">Aytemiz</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://cdnuploads.aa.com.tr/uploads/sirkethaberleri/Contents/2019/12/05/thumbs_b_c_0b2c7d09a483922cb8fb9d9c25cfa3c7.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {aytemizPrice[1]}₺</Text>
                <Text variant="bodyLarge">Benzin: {aytemizPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style={{marginBottom:10}}>
          <Card.Content>
            <Text variant="titleLarge">Petrol Ofisi</Text>
            <Card.Cover
              style={{ marginTop: 10 }}
              source={{
                uri: "https://i.dunya.com/storage/files/images/2021/09/21/petrol-ofisi-bV0P_cover.jpg",
              }}
            />
            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View style={{ marginTop: 10, alignItems:'center' }}>
                <Text variant="bodyLarge">Motorin: {petrolOfisiPrice[1]}₺</Text>
                <Text variant="bodyLarge">Benzin: {petrolOfisiPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};
export default Index;
