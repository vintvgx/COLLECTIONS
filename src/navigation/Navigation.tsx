import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import { RegisterScreen } from "../screens/Register";
import { HomeScreen } from "../screens/Home";
import Creator from "../screens/Creator";
import Profile from "../screens/Profile";

import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator<RootStackParams>();

/* How to use Navigation in screens:

import { RootStackParams } from "../navigation/Navigation";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

call : navigation.navigate("Home");
*/
export type RootStackParams = {
  Register: any;
  Home: any;
  Creator: any;
};

//TODO: Add Collection Initial Page detailing App Functionality & Add to Register Stack
export const RegisterStack = () => (
  <NavigationContainer>
    <RootStack.Navigator initialRouteName="Register">
      <RootStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="Home" component={HomeScreen} />
    </RootStack.Navigator>
  </NavigationContainer>
);

const getTabBarVisibility = (route: any) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || "Home";
  return routeName !== "Profile";
};

const getIconColor = (focused: boolean) => {
  return focused ? "#000" : "#aaa";
};

export const HomeStack = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

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
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: "",
        })}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="+"
          component={Creator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
