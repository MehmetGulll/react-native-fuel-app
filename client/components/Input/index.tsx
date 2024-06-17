import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./style";

type InputProps = {
  placeholder?: string;
  onChangeText?: (text: string) => void;
};

const Input = ({ onChangeText, placeholder }: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        onChangeText={onChangeText}
        style={styles.inputStyle}
        placeholder={placeholder}
      ></TextInput>
    </View>
  );
};
export default Input;
