import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux_toolkit";
import { checkUsernameAvailability } from "../../redux_toolkit/slices/user_data";
import RegisterTextField from "./RegisterTextInput";

type SetUpProfileViewProps = {
  avatarUri?: string;
  onImageUpload: () => void;
  username: string;
  firstName: string;
  lastName: string;
  onUserNameChage: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  isUsernameAvailable: boolean;
  onCheckUsername: (value: string) => void;
};

const SetUpProfileView: React.FC<SetUpProfileViewProps> = ({
  avatarUri,
  onImageUpload,
  firstName,
  lastName,
  username,
  onUserNameChage,
  onFirstNameChange,
  onLastNameChange,
  isUsernameAvailable,
  onCheckUsername,
}) => {
  const dispatch: AppDispatch = useDispatch();

  // const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  // Function to check username availability
  // const handleCheckUsername = async (username: string) => {
  //   if (username.length >= 3) {
  //     const isAvailable = await dispatch(checkUsernameAvailability(username));
  //     setIsUsernameAvailable(isAvailable);
  //   } else {
  //     // If the username is less than 3 characters, don't show green or red text
  //     setIsUsernameAvailable(true);
  //   }
  // };

  // // Listen for changes in the username
  // useEffect(() => {
  //   handleCheckUsername(username);
  // }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Set up your profile</Text>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={onImageUpload} style={styles.avatarButton}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>Upload Avatar</Text>
          )}
        </TouchableOpacity>
      </View>
      <RegisterTextField
        label="Username"
        isSecure={false}
        onTextChange={(text: any) => {
          onUserNameChage(text);
          onCheckUsername(username);
        }}
      />
      {username.length >= 3 &&
        (isUsernameAvailable ? (
          <Text style={styles.greenText}>Username is available</Text>
        ) : (
          <Text style={styles.redText}>Username is taken</Text>
        ))}
      <RegisterTextField
        label="First Name"
        isSecure={false}
        onTextChange={(text: any) => {
          onFirstNameChange(text);
        }}
      />
      <RegisterTextField
        label="Last Name"
        isSecure={false}
        onTextChange={(text: any) => {
          onLastNameChange(text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarText: {
    color: "#007BFF",
    fontSize: 16,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  greenText: {
    color: "green",
    fontSize: 16,
  },
  redText: {
    color: "red",
    fontSize: 16,
  },
});

export default SetUpProfileView;
