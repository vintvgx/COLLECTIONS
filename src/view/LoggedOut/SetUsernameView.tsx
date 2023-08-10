import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ButtonWithTitle } from "../../components/ButtonWithTitle";
import { TextField } from "../../components/TextField";

export const SetUsernameView: React.FC = () => {
  const [username, setUsername] = useState("");
  const navigation = useNavigation();

  const handleSetUsername = () => {
    // Save the username (you might want to use Redux or another state management solution here)

    // Navigate to the next screen to set the profile picture
    navigation.navigate("SetProfilePicture");
  };

  return (
    <View style={styles.container}>
      <TextField
        placeholder="Username"
        onTextChange={setUsername}
        isSecure={false}
      />
      <ButtonWithTitle
        title="Next"
        height={50}
        width={325}
        onTap={handleSetUsername}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
