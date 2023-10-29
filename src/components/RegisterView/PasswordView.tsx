import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RegisterTextField from "./RegisterTextInput";

interface PasswordViewProps {
  password: string;
  confirmPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  onValidPassword: (isValid: boolean) => void;
}

const PasswordView: React.FC<PasswordViewProps> = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onValidPassword,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const checkCapitalLetter = (str: string) => /[A-Z]/.test(str);
  const checkNumber = (str: string) => /[0-9]/.test(str);

  const validatePassword = () => {
    if (!confirmPassword) {
      // Return early if confirmPassword is empty
      return;
    }

    let errors = [];
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (!checkCapitalLetter(password)) {
      errors.push("Password missing capital letter");
    }
    if (!checkNumber(password)) {
      errors.push("Password missing a number");
    }

    if (errors.length === 0) {
      setErrorMessage("");
    } else if (errors.length === 1) {
      setErrorMessage(errors[0]);
    } else {
      setErrorMessage(
        "Passwords must match, contain a capital letter, and a number"
      );
    }

    onValidPassword(errors.length === 0);
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
        }}
      />

      <RegisterTextField
        label="Confirm Password"
        isSecure={true}
        onTextChange={(text: React.SetStateAction<string>) => {
          setConfirmPassword(text);
        }}
      />

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
    fontSize: 24,
    fontWeight: "300",
    marginBottom: 20,
    alignSelf: "center",
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    alignSelf: "center",
    fontSize: 11,
  },
});
