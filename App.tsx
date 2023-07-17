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


//TODO   Code implements keeping track of user logged in
//TODO   ERROR: Problem with Provider

// //* REACT
// import { useEffect, useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import { StyleSheet, Text, View } from "react-native";

// //* DEPENDENCIES
// import { Provider, useSelector } from "react-redux";
// // import { store } from "./src/redux";
// import { store } from "./src/redux_toolkit";
// import { auth } from "./src/firebase/f9_config";

// //* NAV DEPENDENCIES
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { HomeStack } from "./src/navigation/Navigation";
// import { RegisterStack } from "./src/navigation/Navigation";
// import { MAIN } from "./src/navigation/Navigation";
// import { LogBox } from "react-native";

// //* USER AUTH DEPENDENCIES
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch } from "react-redux";
// import { RootState } from "./src/redux_toolkit";
// import { setLoggedIn } from "./src/redux_toolkit/slices/authSlice";

// // Ignore specific warning messages
// // LogBox.ignoreLogs([
// //   "source.uri should not be an empty string",
// //   // Add more warning messages you want to ignore here
// // ]);
// LogBox.ignoreAllLogs();

// export default function App() {
//   const [isLoading, setisLoading] = useState(false);
//   const dispatch = useDispatch();
//   // const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
//   const isLoggedIn = false;

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       try {
//         const userToken = await AsyncStorage.getItem("userToken");
//         if (userToken) {
//           // User was previously authenticated, update the Redux state
//           dispatch(setLoggedIn(true));
//         }
//       } catch (error) {
//         console.log("Error reading user token from AsyncStorage:", error);
//       }
//     };

//     // Check authentication status on app load
//     checkAuthentication();

//     // Listen for authentication state changes
//     const unsubscribeAuth = auth.onAuthStateChanged((user) => {
//       if (!user) {
//         // User is not signed in, set isLoggedIn to false
//         dispatch(setLoggedIn(false));
//       } else {
//         // User is signed in, set isLoggedIn to true and save the user token
//         dispatch(setLoggedIn(true));
//         AsyncStorage.setItem("userToken", "userTokenHere");
//       }
//     });

//     // Clean up the subscription
//     return unsubscribeAuth();
//   }, [dispatch]);

//   if (!isLoggedIn) {
//     return (
//       <Provider store={store}>
//         <RegisterStack />
//       </Provider>
//     );
//   }

//   if (isLoggedIn) {
//     return (
//       <Provider store={store}>
//         <MAIN />
//       </Provider>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
