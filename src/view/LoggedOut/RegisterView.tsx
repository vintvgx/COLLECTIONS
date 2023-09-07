import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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

  const { error, isLoading } = useSelector((state: RootState) => state.auth);
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
        console.log(error);
      }
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
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Collections</Text>

      <View style={styles.body}>
        <TextField
          placeholder="Email ID"
          onTextChange={(text: React.SetStateAction<string>) => {
            setEmail(text);
            clearAuthError();
          }}
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
          onTextChange={(text: React.SetStateAction<string>) => {
            setPassword(text);
            clearAuthError();
          }}
          isSecure={true}
          // value="Vent1234"
        />
        <ButtonWithTitle
          title={title}
          height={50}
          width={325}
          onTap={onTapAuthenticate}
          disabled={isLoading}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity onPress={onTapOptions} style={styles.optionsButton}>
          <Text style={styles.optionsText}>
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Futura+ &copy; 2023</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Background color
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  },
});

export default RegisterView;
