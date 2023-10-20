import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RegisterTextField from "./RegisterTextInput";

interface PasswordViewProps {
  setStep: React.Dispatch<React.SetStateAction<"password" | "name" | "final">>;
  password: string;
  confirmPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordView: React.FC<PasswordViewProps> = ({
  setStep,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);

  const isPasswordValid = () => {
    const capitalLetter = /[A-Z]/;
    const number = /[0-9]/;
    return (
      password === confirmPassword &&
      capitalLetter.test(password) &&
      number.test(password)
    );
  };

  const validatePassword = () => {
    const valid = isPasswordValid();
    setIsValid(valid);
    if (confirmPassword !== "") {
      setShouldDisplayError(!valid);
    }
  };

  useEffect(() => {
    validatePassword();
  }, [password, confirmPassword]);

  return (
    <View style={styles.passwordContainer}>
      <Text style={styles.label}>Set Password</Text>
      <RegisterTextField
        label="Password"
        isSecure={true}
        onTextChange={(text: React.SetStateAction<string>) => {
          setPassword(text);
          // setShouldDisplayError(false);
        }}
      />

      <RegisterTextField
        label="Confirm Password"
        isSecure={true}
        onTextChange={(text: React.SetStateAction<string>) => {
          setConfirmPassword(text);
          // setShouldDisplayError(false);
        }}
      />

      {!isValid && shouldDisplayError && (
        <Text style={styles.errorMessage}>
          Passwords must match, contain a capital letter, and a number
        </Text>
      )}
    </View>
  );
};

export default PasswordView;

const styles = StyleSheet.create({
  passwordContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 30,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    alignSelf: "center",
  },
});
