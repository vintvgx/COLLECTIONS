import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/Navigation";

const RegisterSplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("RegisterView");
    }, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>COLLECTIONS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
});

export default RegisterSplashScreen;
