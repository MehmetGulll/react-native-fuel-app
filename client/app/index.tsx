import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Card, Text, ActivityIndicator, MD2Colors } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
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
  interface BarItem {
    value: number;
    
  }
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
  const [loadingBenzinChart, setLoadingBenzinChart] = useState(false);
  const [loadingDieselChart, setLoadingDieselChart] = useState(false);
  const [loadingShell, setLoadingShell] = useState(false);
  const [barDataBenzinPrice, setBarDataBenzinPrice] = useState<
    { label: string; value: number }[]
  >([]);
  const [barDataDieselPrice, setBarDataDieselPrice] = useState<
    { label: string; value: number }[]
  >([]);

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
    console.log("Seçilen şehir", selectedCity);
    setLoadingOpet(true);
    setLoadingBp(true);
    setLoadingKadoil(true);
    setLoadingAlpet(true);
    setLoadingTotal(true);
    setLoadingAytemiz(true);
    setLoadingPetrolOfisi(true);
    setLoadingShell(true);
    setLoadingBenzinChart(true);

    try {
      const results = await Promise.allSettled([
        fetchOpetData(selectedCity),
        fetchBPData(selectedCity),
        fetchKadoilData(selectedCity),
        fetchAlpetData(selectedCity),
        fetchTotalData(selectedCity),
        fetchAytemizData(selectedCity),
        fetchPetrolofisiData(selectedCity),
        fetchShellData(selectedCity),
      ]);
    
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`Error in promise ${index}:`, result.reason);
        }
      });
    
      
      if (results.every(result => result.status === 'fulfilled')) {
        updatedBarDataBenzinPrice();
        updatedBarDataDieselPrice();
      }
    } catch (error) {
      console.log("Unhandled error:", error);
    } finally {
      setLoadingOpet(false);
      setLoadingBp(false);
      setLoadingKadoil(false);
      setLoadingAlpet(false);
      setLoadingTotal(false);
      setLoadingAytemiz(false);
      setLoadingPetrolOfisi(false);
      setLoadingShell(false);
      setLoadingBenzinChart(false);
    }
    
  };
  const updatedBarDataBenzinPrice = () => {
    const updatedBarDataBenzinPrice = [
      { label: "Shell", value: parseFloat(shellBenzinPrice) ?? 0 },
      { label: "Opet", value: parseFloat(opetPrice[0]) ?? 0 },
      { label: "BP", value: parseFloat(bpPrice[0][2]) ?? 0 },
      { label: "Kadoil", value: parseFloat(kadoilPrice[1]) ?? 0 },
      { label: "Alpet", value: parseFloat(alpetPrice[0][0]) ?? 0 },
      { label: "Total", value: parseFloat(totalPrice[0]) ?? 0 },
      { label: "Aytemiz", value: parseFloat(aytemizPrice[0]) ?? 0 },
      {
        label: "Petrol Ofisi",
        value: parseFloat(petrolOfisiPrice[0]) ?? 0,
      },
    ];
    setBarDataBenzinPrice(updatedBarDataBenzinPrice);
  };
  const updatedBarDataDieselPrice = () => {
    const updateBarDataDieselPrice = [
      { label: "Shell", value: parseFloat(shellDizelPrice) ?? 0 },
      { label: "Opet", value: parseFloat(opetPrice[1]) ?? 0 },
      { label: "BP", value: parseFloat(bpPrice[0][3]) ?? 0 },
      { label: "Kadoil", value: parseFloat(kadoilPrice[2]) ?? 0 },
      { label: "Alpet", value: parseFloat(alpetPrice[1][0]) ?? 0 },
      { label: "Total", value: parseFloat(totalPrice[2]) ?? 0 },
      { label: "Aytemiz", value: parseFloat(aytemizPrice[1]) ?? 0 },
      {
        label: "Petrol Ofisi",
        value: parseFloat(petrolOfisiPrice[0]) ?? 0,
      },
    ];
    setBarDataDieselPrice(updateBarDataDieselPrice);
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
        <View style = {{flexDirection:'row', justifyContent:'space-between', marginHorizontal:20}}>
          <View>
            <Text variant="titleSmall">Yakıt Cinsi</Text>
          </View>
          <View style = {{flexDirection:'row', gap:20}}>
            <Text variant="titleSmall">Motorin</Text>
            <Text variant="titleSmall">Benzin</Text>
          </View>
        </View>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2', marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium" >Shell</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Text variant="bodyLarge">{shellDizelPrice}₺</Text>
                <Text variant="bodyLarge">{shellBenzinPrice}₺</Text>
              </View>
            ) : (
              <Text variant="bodyLarge">.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Opet</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{opetPrice[1]}₺</Text>
                <Text variant="bodyLarge">{opetPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">BP</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{bpPrice[0][3]}₺</Text>
                <Text variant="bodyLarge">{bpPrice[0][2]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Kadoil</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{kadoilPrice[2]}₺</Text>
                <Text variant="bodyLarge">{kadoilPrice[1]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Alpet</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{alpetPrice[1][0]}₺</Text>
                <Text variant="bodyLarge">{alpetPrice[0][0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Total</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{totalPrice[2]}₺</Text>
                <Text variant="bodyLarge">{totalPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2',marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Aytemiz</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{aytemizPrice[1]}₺</Text>
                <Text variant="bodyLarge">{aytemizPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        <Card style = {{borderWidth:2, borderColor:'#b2cbf2', marginBottom:10,marginHorizontal:20}}>
          <Card.Content
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text variant="titleMedium">Petrol Ofisi</Text>
            </View>

            {loadingShell ? (
              <ActivityIndicator animating={true} color={MD2Colors.red800} />
            ) : shellPrice.length > 0 ? (
              <View
                style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
              >
                <Text variant="bodyLarge">{petrolOfisiPrice[1]}₺</Text>
                <Text variant="bodyLarge">{petrolOfisiPrice[0]}₺</Text>
              </View>
            ) : (
              <Text>.</Text>
            )}
          </Card.Content>
        </Card>
        {loadingBenzinChart ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : barDataBenzinPrice.length > 0 ? (
          <View style = {{borderWidth:1, borderColor:'red', padding:5, borderRadius:15}}>
            <View style={{ alignItems: "center" }}>
              <Text variant="titleSmall">Benzin Fiyatları Grafik</Text>
            </View>
            <View >
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="#b2cbf2"
                data={barDataBenzinPrice}
                yAxisThickness={0}
                xAxisThickness={0}
                isAnimated
                renderTooltip={(item: BarItem) => {
                  return (
                    <View
                      style={{
                      
                        marginLeft: -6,
                        backgroundColor: "#ffcefe",
                        paddingHorizontal: 6,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text>{` ${item.value}`}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        ) : (
          <Text>.</Text>
        )}
        {loadingDieselChart ? (
          <ActivityIndicator animating={true} color={MD2Colors.red800} />
        ) : barDataDieselPrice.length > 0 ? (
          <View style = {{borderWidth:1, borderColor:'red', padding:5, borderRadius:15, marginVertical:10}}>
            <View style={{ alignItems: "center" }}>
              <Text variant="titleSmall">Motorin Fiyatları Grafik</Text>
            </View>
            <View>
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="#b2cbf2"
                data={barDataDieselPrice}
                yAxisThickness={0}
                xAxisThickness={0}
                isAnimated
                renderTooltip={(item: BarItem) => {
                  return (
                    <View
                      style={{
                        marginTop: 5,
                        marginLeft: -6,
                        backgroundColor: "#ffcefe",
                        paddingHorizontal: 6,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}
                    >
                      <Text>{item.value}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        ) : (
          <Text>.</Text>
        )}
      </View>
    </ScrollView>
  );
};
export default Index;
