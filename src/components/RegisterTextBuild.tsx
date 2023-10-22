// RegisterTestBuild.tsx

import React from "react";
import { TextField } from "./TextField";
import { ButtonWithTitle } from "./ButtonWithTitle";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RegisterTestBuildProps {
  title: string;
  isSignup: boolean;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onTapAuthenticate: () => Promise<void>;
  clearAuthError: () => void;
  onTapOptions: () => void;
  isLoading: boolean;
  error: string | undefined;
}

const RegisterTestBuild: React.FC<RegisterTestBuildProps> = ({
  title,
  isSignup,
  setEmail,
  setUsername,
  setPassword,
  onTapAuthenticate,
  clearAuthError,
  onTapOptions,
  isLoading,
  error,
}) => {
  return (
    <>
      <TextField
        placeholder="Email ID"
        onTextChange={(text: React.SetStateAction<string>) => {
          setEmail(text);
          clearAuthError();
        }}
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
        onTextChange={(text: React.SetStateAction<string>) => {
          setPassword(text);
          clearAuthError();
        }}
        isSecure={true}
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
    </>
  );
};

const styles = StyleSheet.create({
  optionsButton: {
    marginTop: 20,
  },
  optionsText: {
    color: "#3498db",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
});

export default RegisterTestBuild;
