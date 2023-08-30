import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import RegisterSplashScreen from "../components/RegisterSplashScreen";
import { RegisterScreen } from "../screens/Register";
import RegisterSetupProfileView from "../view/LoggedOut/RegisterSetupProfileView";
import { HomeScreen } from "../screens/Home";
import Creator from "../screens/Creator";
import Profile from "../screens/Profile";
import ProfileSettings from "../screens/ProfileSettings";
import PersonalDetails from "../components/ProfileSettings/PersonalDetails";

//views
//TODO Implement MVC Structure
import FeedView from "../view/LoggedIn/FeedView";
import ProfileView from "../view/LoggedIn/ProfileView";
import RegisterView from "../view/LoggedOut/RegisterView";
import CreatorView from "../view/LoggedIn/CreatorView";
import CollectionFeedView from "../view/LoggedIn/CollectionFeedView";
import AddCollectionView from "../view/LoggedIn/AddCollectionView";
import ProfileCollectionView from "../view/LoggedIn/ProfileCollectionView";

import { Ionicons } from "@expo/vector-icons";
import { LoginProps } from "../model/types";
import { EventRegister } from "react-native-event-listeners";
import { useTheme } from "../theme/themeContext";
import { OnUserLogin, OnUserSignup } from "../redux_toolkit/slices/authSlice";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParams>();
const MainStack = createNativeStackNavigator<MainStackParams>();

export type RootStackParams = {
  RegisterSplashScreen: any;
  RegisterView: LoginProps;
  RegisterSetupProfileView: any;
  Home: any;
  CollectionFeedView: {
    title: string;
    uid: string;
  };
  Creator: any;
  AddCollectionView: {
    images: any;
  };
  ProfileCollectionView: {
    title: string;
    uid: string;
  };
  ProfileSettings: any;
  PersonalDetails: any;
};

export type MainStackParams = {
  Home: any;
  ProfileSettings: any;
  PersonalDetails: any;
  AddCollectionView: {
    images: any;
  };
  CollectionFeedView: {
    title: string;
    uid: string;
  };
  ProfileCollectionView: {
    title: string;
    uid: string;
  };
};

//TODO: Add Collection Initial Page detailing App Functionality & Add to Register Stack
export const MAIN = () => {
  const { darkMode } = useTheme();
  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <MainStack.Navigator>
        <MainStack.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="CollectionFeedView"
          component={CollectionFeedView}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="AddCollectionView"
          component={AddCollectionView}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="ProfileCollectionView"
          component={ProfileCollectionView}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="PersonalDetails"
          component={PersonalDetails}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export const RegisterStack = () => {
  const { darkMode } = useTheme();

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator initialRouteName="RegisterSplashScreen">
        <RootStack.Screen
          name="RegisterSplashScreen"
          component={RegisterSplashScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="RegisterView"
          children={() => (
            <RegisterView
              OnUserLogin={OnUserLogin}
              OnUserSignup={OnUserSignup}
            />
          )}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="RegisterSetupProfileView"
          component={RegisterSetupProfileView}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const getTabBarVisibility = (route: any) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Home";
  return routeName !== "Profile";
};

const getIconColor = (focused: boolean) => {
  return focused ? "#000" : "#aaa";
};

type IconName =
  | "home"
  | "home-outline"
  | "add-circle"
  | "add-circle-outline"
  | "person"
  | "person-outline";

export const HomeStack = () => {
  const { darkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IconName = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "+") {
            iconName = focused ? "add-circle" : "add-circle-outline";
            size = 35;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={getIconColor(focused)}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: darkMode ? "#d3d3d3" : "#fff", // Change as per your requirement
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          paddingVertical: 10,
        },
        tabBarVisible: getTabBarVisibility(route),
        tabBarLabel: "",
      })}>
      <Tab.Screen
        name="Home"
        component={FeedView}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="+"
        component={CreatorView}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
