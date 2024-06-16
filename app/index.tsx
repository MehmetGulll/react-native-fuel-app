import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import Input from "@/components/Input";
import Button from "@/components/Button";
import React, { useState } from "react";
import Carousel from "react-native-snap-carousel";
import { BlurView } from "expo-blur";
import axios from "axios";

export default function Index() {
  const [city, setCity] = useState("");
  const [couty, setCouty] = useState("");
  const [data, setData] = useState<Item[]>([]);
  const [date, setDate] = useState();
  const defaultImage = require("../assets/images/akaryakit.png");
  const [backgroundImage, setBackgroundImage] =
    useState<ImageSourcePropType>(defaultImage);

  interface Images {
    [key: string]: ImageSourcePropType;
  }
  interface Item {
    marka: string;
    dizel: number;
    katkili: number;
  }
  const images: Images = {
    Aytemiz: require("../assets/images/aytemiz.jpg"),
    Alpet: require("../assets/images/alpet.png"),
    Lukoil: require("../assets/images/lukoil.jpg"),
    Opet: require("../assets/images/opet.jpg"),
    "Petrol Ofisi": require("../assets/images/petrolofisi.jpg"),
    Shell: require("../assets/images/shell.png"),
    Total: require("../assets/images/total.jpg"),
    BP: require("../assets/images/BP.jpg"),
    "M Oil": require("../assets/images/Moil.jpg"),
    Kadoil: require("../assets/images/kadoil.jpg"),
  };
  const handleButton = async () => {
    try {
      const response = await axios.get(
        `${process.env.API_HOST}?district=${couty}&city=${city}`,
        {
          headers: {
            "content-type": "application/json",
            authorization:
              "apikey 2GGj8JJCRcIyWKuMYLJkec:2tj7RKu6oEY3EwW7GNhZbu",
          },
        }
      );
      setData(response.data.result);
      setDate(response.data.lastupdate);
      console.log(response.data);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const _renderItem = ({ item, index }: { item: Item; index: number }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={images[item.marka]}
          style={{ width: 275, height: 240 }}
        />
        <Text>{item.marka}</Text>
        <Text>
          Dizel:{" "}
          {Number(item.dizel).toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </Text>
        <Text>
          Euro Dizel:{" "}
          {Number(item.katkili).toLocaleString("tr-TR", {
            style: "currency",
            currency: "TRY",
          })}
        </Text>
      </View>
    );
  };
  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <BlurView style={{ flex: 1 }} intensity={100}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View>
              {date && (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text>Son Güncelleme:</Text>
                  <Text>{date}</Text>
                </View>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Input
                placeholder={"İl giriniz"}
                onChangeText={(value) => setCity(value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                placeholder={"İlçe giriniz"}
                onChangeText={(value) => setCouty(value)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button text={"Fiyatları Gör"} onPress={handleButton} />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            {data && (
              <Carousel
                data={data}
                renderItem={_renderItem}
                sliderWidth={300}
                itemWidth={300}
                enableMomentum={true}
                onSnapToItem={(index) =>
                  setBackgroundImage(images[data[index].marka])
                }
              />
            )}
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 25,
  },
  buttonContainer: {
    marginTop: 15,
    marginHorizontal: 50,
  },
});
