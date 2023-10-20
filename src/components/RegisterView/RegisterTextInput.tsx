import React, { useRef, useState } from "react";
import { View, TextInput, Animated, StyleSheet } from "react-native";
import { animateLabel } from "../../utils/animation";

interface RegisterTextFieldProps {
  label: string;
  isSecure: boolean;
  onTextChange: Function;
  focusAuto?: boolean;
}

const RegisterTextField: React.FC<RegisterTextFieldProps> = ({
  label,
  isSecure,
  onTextChange,
  focusAuto,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const labelPosition = useRef(new Animated.Value(10)).current;

  return (
    <View style={styles.container}>
      <Animated.Text
        style={{
          opacity: labelOpacity,
          transform: [{ translateY: labelPosition }],
        }}>
        {label}
      </Animated.Text>
      <TextInput
        autoFocus={focusAuto}
        secureTextEntry={isSecure}
        style={styles.passwordInput}
        placeholder={isFocused ? "" : label}
        onFocus={() => {
          setIsFocused(true);
          animateLabel(true, labelPosition, labelOpacity);
        }}
        onBlur={() => {
          setIsFocused(false);
          animateLabel(false, labelPosition, labelOpacity);
        }}
        onChangeText={(text) => onTextChange(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    alignSelf: "center",
  },
  passwordInput: {
    height: 50,
    borderColor: "#fff",
    borderBottomColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});

export default RegisterTextField;
