import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

type SetUpProfileViewProps = {
  avatarUri?: string;
  onImageUpload: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
};

const SetUpProfileView: React.FC<SetUpProfileViewProps> = ({
  avatarUri,
  onImageUpload,
  onFirstNameChange,
  onLastNameChange,
}) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.headerText}>Set up your profile</Text>
      <TouchableOpacity onPress={onImageUpload} style={styles.avatar}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>Upload your avatar</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={onFirstNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={onLastNameChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    color: "#777",
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
});

export default SetUpProfileView;
