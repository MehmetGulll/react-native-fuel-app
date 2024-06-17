import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "./styles";

type ButtonProps = {
  text?: string;
  onPress(): void;
};

const Button = ({ text, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
