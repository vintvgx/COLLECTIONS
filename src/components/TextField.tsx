import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    borderRadius: 30,
    backgroundColor: "#DBDBDB",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 20,
    paddingRight: 10,
    width: 325,
  },
  textField: {
    flex: 1,
    height: 50,
    fontSize: 20,
    color: "#000",
  },
});
