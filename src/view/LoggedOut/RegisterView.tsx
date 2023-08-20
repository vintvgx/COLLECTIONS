import { Keyboard, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { TextField } from "../../components/TextField";
import { ButtonWithTitle } from "../../components/ButtonWithTitle";
import { useDispatch } from "react-redux";
import { OnUserLogin } from "../../redux_toolkit/slices/authSlice";
import { OnUserSignup } from "../../redux_toolkit/slices/authSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/Navigation";
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
  const dispatch = useDispatch();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const onTapAuthenticate = async () => {
    try {
      if (isSignup) {
        await dispatch(OnUserSignup({ email, username, password }));
        navigation.navigate("RegisterSetupProfileView");
      } else {
        // OnUserLogin(email, password);
        await dispatch(OnUserLogin({ email: email, password: password }));
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const onTapOptions = () => {
    setIsSignup(!isSignup);
    setTitle(!isSignup ? "Signup" : "Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextField
          placeholder="Email ID"
          onTextChange={setEmail}
          isSecure={false}
          // value="kareems95@gmail.com"
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
          // value="Vent1234"
        />

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

export default RegisterView;
