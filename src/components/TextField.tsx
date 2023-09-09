import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // You can import icons from a suitable library

interface TextFieldProps {
  placeholder?: string;
  isSecure?: boolean;
  onTextChange: Function;
  value?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  isSecure = false,
  onTextChange,
  value,
}) => {
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    setIsPassword(isSecure);
  }, []);

  const clearText = () => {
    onTextChange("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        autoCapitalize="none"
        secureTextEntry={isPassword}
        onChangeText={(text) => onTextChange(text)}
        style={styles.textField}
        value={value}
        autoCorrect={false}
      />
      {value && (
        <TouchableOpacity onPress={clearText} style={styles.clearButton}>
          <Ionicons name="close-circle-outline" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 20,
    paddingRight: 10,
    width: 325,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  textField: {
    flex: 1,
    height: 50,
    fontSize: 16, // Slightly smaller font size
    color: "#000",
  },
  clearButton: {
    paddingHorizontal: 8,
  },
});
