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
import React, { Component, useEffect } from "react";
import Footer from "../shared/footer";
import { auth } from "../firebase/f9_config";
import { signInWithEmailAndPassword } from "firebase/auth";

export default class SignIn extends Component {
  // useEffect = () => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       const uid = user.uid;
  //       console.log(user);
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //       console.log("Confirmed USER is set to:", user);
  //     }
  //   });
  // };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
    const { email, password } = this.state;
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <SafeAreaView>
        <View style={[styles.container, styles.shadowProp]}>
          <TextInput
            label="E-mail"
            placeholder="Email"
            placeholderTextColor="white"
            style={styles.form}
            onChangeText={(email) => this.setState({ email })}
          />
          {/* <Text style={styles.errorText}>ERROR placeholder</Text>  */}
          <TextInput
            label="Password"
            placeholder="Password"
            placeholderTextColor="white"
            style={styles.form}
            secureTextEntry
            onChangeText={(password) => this.setState({ password })}
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
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "block",
    backgroundColor: "white",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    // flex: 1,

    alignSelf: "center",

    margin: "auto",
  },
  font: {
    fontSize: 55,
    color: "#fff",
    fontFamily: "Arial",
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: "auto",
  },
  form: {
    width: 300,
    height: 60,
    fontSize: 18,
    borderColor: "white",
    padding: 10,
    borderWidth: 3,
    marginVertical: 10,
    margin: 5,
    backgroundColor: "#080808",
    color: "white",
    // width: 266px;
    // height: 52px;

    borderRadius: 15,
  },
  shadowProp: {
    shadowColor: "#fff",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
    textAlign: "center",
  },
  submitButton: {
    alignSelf: "center",
    marginTop: "10%",
    backgroundColor: "#000",
    width: 235,
    height: 60,
    borderRadius: 25,
  },
  submitText: {
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "200",
    color: "white",
    marginTop: 20,
    justifyContent: "center",
  },
});
