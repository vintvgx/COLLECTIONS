import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { UserData, ImageData } from "../../model/types";
import { RootStackParams } from "../../navigation/Navigation";
import { useDispatch } from "react-redux";
import { saveUserData } from "../../redux_toolkit/slices/user_data";
import { AppDispatch } from "../../redux_toolkit";

const RegisterSetupProfileView: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const dispatch: AppDispatch = useDispatch();
  const currentDateTime = new Date();
  const currentTimestamp = new Date().toISOString();

  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<ImageData | undefined>(undefined);
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    avatar: undefined,
  });

  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } = await Permissions.askAsync(
        Permissions.CAMERA
      );
      const { status: libraryStatus } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY
      );

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert(
          "Permissions required",
          "Please grant camera and photo library permissions to use this feature.",
          [{ text: "OK", onPress: () => console.log("OK pressed") }]
        );
      }
    };
    getPermissions();
  }, []);

  const validateFields = () => {
    const { username, firstName, lastName } = formData;
    const isNextButtonEnabled =
      username !== "" && firstName !== "" && lastName !== "";
    setNextButtonEnabled(isNextButtonEnabled);

    if (!isNextButtonEnabled) {
      Alert.alert(
        "Incomplete fields",
        "Please fill in all the required fields.",
        [{ text: "OK", onPress: () => console.log("OK pressed") }]
      );
    }
  };

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];

      const avatar = {
        assetId: selectedImage.assetId,
        fileName: selectedImage.fileName,
        fileSize: selectedImage.fileSize,
        height: selectedImage.height,
        type: selectedImage.type,
        uri: selectedImage.uri,
        width: selectedImage.width,
        createdAt: currentTimestamp,
      };

      try {
        //@ts-ignore
        setAvatar(avatar);
        setAvatarUri(result.assets[0].uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUserDataUpload = async () => {
    try {
      await dispatch(saveUserData({ ...formData, avatar: avatar }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    validateFields();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }} />
          {nextButtonEnabled ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleImageUpload} style={styles.avatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>Upload your avatar</Text>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(value) => handleChange("username", value)}
          value={formData.username}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(value) => handleChange("firstName", value)}
          value={formData.firstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(value) => handleChange("lastName", value)}
          value={formData.lastName}
        />
        <TouchableOpacity onPress={handleUserDataUpload} style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  nextButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default RegisterSetupProfileView;
