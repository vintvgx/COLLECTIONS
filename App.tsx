//* REACT
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

//* DEPENDENCIES
import { Provider } from "react-redux";
// import { store } from "./src/redux";
import { store } from "./src/redux_toolkit";
import { auth } from "./src/firebase/f9_config";

//* NAV DEPENDENCIES
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStack } from "./src/navigation/Navigation";
import { RegisterStack } from "./src/navigation/Navigation";
import { MAIN } from "./src/navigation/Navigation";
import { LogBox } from "react-native";

// Ignore specific warning messages
// LogBox.ignoreLogs([
//   "source.uri should not be an empty string",
//   // Add more warning messages you want to ignore here
// ]);
LogBox.ignoreAllLogs();

export default function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (!user) {
        setisLoggedIn(false);
        console.log("NOT SIGNED IN");
      } else {
        setisLoggedIn(true);
        console.log("SIGNED IN");
      }
    });
  }, []);

  if (!isLoggedIn) {
    return (
      <Provider store={store}>
        <RegisterStack />
      </Provider>
    );
  }

  if (isLoggedIn) {
    return (
      <Provider store={store}>
        <MAIN />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
