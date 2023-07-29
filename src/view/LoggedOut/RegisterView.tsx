import { Keyboard, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";

import { TextField } from "../../components/TextField";
import { ButtonWithTitle } from "../../components/ButtonWithTitle";
import { useDispatch } from "react-redux";

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

  const onTapAuthenticate = () => {
    if (isSignup) {
      OnUserSignup(email, username, password);
    } else {
      // OnUserLogin(email, password);
      dispatch(OnUserLogin({ email: email, password: password }));
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
