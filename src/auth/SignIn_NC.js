import {
  Text,
  View,
  SafeAreaView,
  Formik,
  TextInput,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import Footer from "../shared/footer";
import { auth } from "../firebase/f9_config";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn_NC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).then((result) => {
      console.log(result);
    });
  };

  return (
    <SafeAreaView>
      <View style={[styles.container, styles.shadowProp]}>
        <TextInput
          label="E-mail"
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          style={styles.form}
          onChangeText={(text) => setEmail(text)}
        />
        {/* <Text style={styles.errorText}>ERROR placeholder</Text>  */}
        <TextInput
          label="Password"
          placeholder="Password"
          placeholderTextColor="white"
          value={password}
          style={styles.form}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        {/* <Text style={styles.errorText}>PASSWORD ERR</Text>  */}
        <TouchableOpacity
          // text={loading ? 'Loading...' : 'Sign In'}
          type="Submit"
          title="Submit"
          style={styles.submitButton}
          onPress={() => this.onSignIn()}>
          <Text style={styles.submitText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default SignIn_NC;

const styles = StyleSheet.create({});
