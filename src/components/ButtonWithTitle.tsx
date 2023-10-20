import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onTap: Function;
  width: number;
  height: number;
  title: string;
  isNoBg?: boolean;
  disabled?: boolean;
}

const ButtonWithTitle: React.FC<ButtonProps> = ({
  onTap,
  width,
  height,
  title,
  isNoBg = false,
  disabled,
}) => {
  const backgroundColor = disabled ? "#ccc" : isNoBg ? "transparent" : "#000";
  const textColor = disabled ? "#888" : isNoBg ? "#3980D9" : "#FFF";

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          width,
          height,
          backgroundColor: backgroundColor,
        },
        disabled && styles.btnDisabled,
      ]}
      onPress={() => onTap()}
      disabled={disabled}>
      <Text
        style={[
          styles.btnText,
          {
            color: textColor,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
    elevation: 3,
  },
  btnText: {
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.6,
    elevation: 0,
  },
});

export { ButtonWithTitle };
