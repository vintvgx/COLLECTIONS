import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store, useAppSelector } from "./src/redux_toolkit";
import { auth } from "./src/utils/firebase/f9_config";
import { setIsProfileSet } from "./src/redux_toolkit/slices/user_data";
import { setLoggedIn } from "./src/redux_toolkit/slices/authSlice";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { EventRegister } from "react-native-event-listeners";
import { ThemeProvider } from "./src/theme/themeContext";

import { HomeStack } from "./src/navigation/Navigation";
import { RegisterStack } from "./src/navigation/Navigation";
import { MAIN } from "./src/navigation/Navigation";
import { LogBox } from "react-native";
import {
  fetchUserData,
  selectIsProfileSet,
} from "./src/redux_toolkit/slices/user_data";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Root = () => {
  const dispatch: AppDispatch = useDispatch();

  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { isProfileSet } = useAppSelector((state) => state.userData);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("SIGNED IN");
        const profileUser = await dispatch(fetchUserData()); // Function to fetch user profile data from Firebase Firestor
        console.log(
          "🚀 ~ file: App.tsx:29 ~ auth.onAuthStateChanged ~ profileUser:",
          profileUser
        );
        console.log(
          "🚀 ~ file: App.tsx:29 ~ auth.onAuthStateChanged ~ profileUser:",
          profileUser.isProfileSet
        );

        if (profileUser.isProfileSet) {
          // Update isProfileSet flag in Redux
          dispatch(setIsProfileSet(true));
        }
      } else {
        console.log("SIGNED OUT");
        dispatch(setLoggedIn(false));
        dispatch(setIsProfileSet(false));
      }
    });
  }, [auth]);

  console.log(isLoggedIn);
  console.log(isProfileSet);

  if (!isLoggedIn || !isProfileSet) {
    console.log("NOT LOGGED IN");
    return <RegisterStack />;
  }

  if (isLoggedIn && isProfileSet) {
    console.log("LOGGED IN");
    return <MAIN />;
  }

  return null; // Render nothing if none of the above conditions are met
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
