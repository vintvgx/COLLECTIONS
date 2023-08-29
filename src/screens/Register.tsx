import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  Appearance,
  useColorScheme,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { unwrapResult } from "@reduxjs/toolkit";

import { TextField } from "../components/TextField";
import { ButtonWithTitle } from "../components/ButtonWithTitle";
import { connect } from "react-redux";

import { OnUserSignup } from "../redux_toolkit/slices/authSlice";
import { OnUserLogin } from "../redux_toolkit/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/Navigation";
import { useTheme } from "../theme/themeContext";

interface LoginProps {
  OnUserLogin: Function;
  OnUserSignup: Function;
}

const _RegisterScreen: React.FC<LoginProps> = ({
  OnUserLogin,
  OnUserSignup,
}) => {
  let result = "";
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Login");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const theme = {
    backgroundColor: darkMode ? "#000" : "#fff",
    color: darkMode ? "#fff" : "#000",
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const onTapAuthenticate = async () => {
    try {
      setErrorMessage(null);
      if (isSignup) {
        try {
          const resultAction = await dispatch(
            OnUserSignup({ email, username, password })
          );
          result = unwrapResult(resultAction); // If the promise is rejected, this will throw an error
          if (result === "Signup Success") {
            navigation.navigate("RegisterSetupProfileView");
          } else {
            console.log("Signup Error:", result);
          }
        } catch (error) {
          // If the promise is rejected, the error will be caught here
          console.log("Signup Error:", result);
          // Set the error message in the component state
          setErrorMessage(result || "An error occurred during signup");
        }
      } else {
        const resultAction = await dispatch(
          OnUserLogin({ email: email, password: password })
        );
        const result = unwrapResult(resultAction);
        if (result === "Login Success") {
          navigation.navigate("RegisterSetupProfileView");
        }
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: Register.tsx:62 ~ onTapAuthenticate ~ error:",
        error
      );
    }
  };

  const onTapOptions = () => {
    setIsSignup(!isSignup);
    setTitle(!isSignup ? "Signup" : "Login");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.body}>
        <TextField
          placeholder="Email ID"
          onTextChange={setEmail}
          isSecure={false}
        />

        {isSignup && (
          <TextField
            placeholder="Phone Number"
            onTextChange={setUsername}
            isSecure={false}
          />
        )}
        <TextField
          placeholder="Password"
          onTextChange={setPassword}
          isSecure={true}
        />

        {errorMessage && (
          <Text style={{ color: "red", marginTop: 10 }}>{errorMessage}</Text>
        )}

        <ButtonWithTitle
          title={title}
          height={50}
          width={325}
          onTap={onTapAuthenticate}
        />

        <ButtonWithTitle
          title={
            !isSignup
              ? "No Account? Signup Here"
              : "Have an Account? Login Here"
          }
          height={50}
          width={350}
          onTap={onTapOptions}
          isNoBg={true}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 2,
    justifyContent: "center",
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

const RegisterScreen = connect(mapStateToProps, { OnUserLogin, OnUserSignup })(
  _RegisterScreen
);

export { RegisterScreen };
