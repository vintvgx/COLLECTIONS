import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { TextField } from "../../components/TextField";
import { ButtonWithTitle } from "../../components/ButtonWithTitle";
import { useDispatch } from "react-redux";
import { clearError, OnUserLogin } from "../../redux_toolkit/slices/authSlice";
import { OnUserSignup } from "../../redux_toolkit/slices/authSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/Navigation";
import { RootState, useAppSelector } from "../../redux_toolkit";
import { useSelector } from "react-redux";
import RegisterTestBuild from "../../components/RegisterTextBuild";
import { unwrapResult } from "@reduxjs/toolkit";
import RegisterTextField from "../../components/RegisterView/RegisterTextInput";

interface LoginProps {
  OnUserLogin: Function;
  OnUserSignup: Function;
}

const RegisterView: React.FC<LoginProps> = ({ OnUserLogin, OnUserSignup }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Login");
  const [isSignup, setIsSignup] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [attemptedSignIn, setAttemptedSignIn] = useState(false);

  const [testBuild, setTestBuild] = useState(false);

  const { error, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const onTapContinue = async () => {
    try {
      // Try to log the user in with a random password
      await dispatch(
        OnUserLogin({ email: email, password: "anyRandomPassword" })
      ).then(unwrapResult); // unwrapResult will throw an error if the promise is rejected
    } catch (error) {
      // If error is 'user-not-found', navigate to RegisterSetupProfileView
      if (error == "User Not Found") {
        navigation.navigate("RegisterSetupProfileView", { email }); // Pass email as a parameter
      } else {
        setShowPasswordField(true);
      }
    }
  };

  const onTapAuthenticate = async () => {
    try {
      setAttemptedSignIn(true);
      await dispatch(OnUserLogin({ email: email, password: password })).then(
        unwrapResult
      );
      console.log("Successfully logged in");
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const onTapOptions = () => {
    setIsSignup(!isSignup);
    setTitle(!isSignup ? "Signup" : "Login");
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Title */}
      <View style={{ alignSelf: "flex-end", marginRight: 10 }}>
        {/* <Text style={styles.title}>Collections</Text> */}
        <Switch
          style={{ justifyContent: "flex-end" }}
          value={testBuild}
          onChange={() => {
            setTestBuild(!testBuild);
          }}
        />
      </View>

      <View style={styles.body}>
        {testBuild ? (
          <RegisterTestBuild
            title={title}
            isSignup={isSignup}
            setEmail={setEmail}
            setUsername={setUsername}
            setPassword={setPassword}
            onTapAuthenticate={onTapAuthenticate}
            clearAuthError={clearAuthError}
            onTapOptions={onTapOptions}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          // New view for testBuild = false
          <View style={{ width: "100%" }}>
            {/* <Image
              source={require("../../../assets/logo_nofill.png")}
              style={{
                width: 45,
                height: 45,
                marginBottom: 20,
                alignSelf: "center",
              }}
            /> */}
            <Text style={styles.authTitle}>Login or Sign Up</Text>

            <RegisterTextField
              label="Email"
              onTextChange={(text: React.SetStateAction<string>) => {
                setEmail(text);
                clearAuthError();
              }}
              isSecure={false}
              focusAuto={true}
            />
            {showPasswordField && (
              <RegisterTextField
                label="Password"
                onTextChange={(text: React.SetStateAction<string>) => {
                  setPassword(text);
                  clearAuthError();
                }}
                isSecure={true}
              />
            )}

            <ButtonWithTitle
              title={showPasswordField ? "Sign In" : "Continue"}
              height={50}
              width={325}
              onTap={showPasswordField ? onTapAuthenticate : onTapContinue}
              disabled={
                showPasswordField ? email.length === 0 : email.length === 0
              }
            />
            {showPasswordField && attemptedSignIn && error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            <Text
              style={{
                fontSize: 10,
                color: "gray",
                width: 300,
                textAlign: "center",
                marginTop: 20,
                alignSelf: "center",
              }}>
              By signing up, you are creating a Collections account and agree to
              Collections Terms and Privacy Policy.
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Futura+ &copy; 2023</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Background color
    width: "100%",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  authTitle: {
    fontSize: 24, // equivalent to 4rem
    fontWeight: "300",
    marginBottom: 20, // adds some space below the title
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionsButton: {
    marginTop: 20,
  },
  optionsText: {
    color: "#3498db", // Highlight color
    fontSize: 16,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#ccc", // Soft light gray
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default RegisterView;
