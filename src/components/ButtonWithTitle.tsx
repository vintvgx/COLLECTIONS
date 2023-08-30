import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onTap: Function;
  width: number;
  height: number;
  title: string;
  isNoBg?: boolean;
}

const ButtonWithTitle: React.FC<ButtonProps> = ({
  onTap,
  width,
  height,
  title,
  isNoBg = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          width,
          height,
          backgroundColor: isNoBg ? "transparent" : "#000",
        },
      ]}
      onPress={() => onTap()}>
      <Text
        style={[
          styles.btnText,
          {
            color: isNoBg ? "#3980D9" : "#FFF",
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
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 20,
    elevation: 3,
  },
  btnText: {
    fontSize: 16,
  },
});

export { ButtonWithTitle };
