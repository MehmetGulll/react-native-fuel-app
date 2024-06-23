import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  oilStationContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
    marginHorizontal: 5,
  },
  oilTitleTextContainer: {
    alignItems: "center",
  },
  oilText: {
    fontSize: 24,
    fontWeight: "600",
  },
  oilPriceText: {
    fontWeight: "600",
    fontSize: 24,
  },
  oilImageStyle:{
    width: "100%",
    height: 250,
    resizeMode: "stretch",
    borderRadius: 15,
  }
});

export default styles;
