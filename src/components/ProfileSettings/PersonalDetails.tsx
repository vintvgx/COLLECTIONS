import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ProfileUser, UserData } from "../../utils/types";
import { saveUserData } from "../../redux_toolkit/slices/user_data";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux_toolkit";
import { fetchUserData } from "../../redux_toolkit/slices/user_data";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

interface ProfileSettingsProps extends ProfileUser {}

const PersonalDetails: React.FC<ProfileSettingsProps> = () => {
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack(); // Navigates back to the previous screen
  };

  const { firstName, lastName, username, bio, avatar } = useAppSelector(
    (state) => state.userData.userData
  );

  const [formData, setFormData] = useState<UserData>({
    firstName: firstName,
    lastName: lastName,
    username: username,
    bio: bio,
    avatar: avatar,
  });

  useEffect(() => {
    console.log("OUTPUT: " + firstName + lastName + username + bio + avatar);
    //@ts-ignore
    dispatch(fetchUserData());
    console.log("PersonalDetails: avatar?" + avatar?.uri);

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
  }, [dispatch]);

  const handleSave = async () => {
    //@ts-ignore
    await dispatch(saveUserData(formData));
    handleBack();
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleTextInputFocus = (field: keyof UserData) => {
    if (formData[field] === "") {
      handleChange(field, "");
    }
  };

  const addCollection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      // setImages([...images, { uri: result.uri }]);
      console.log(selectedImage);
      const updatedAvatar = {
        assetId: selectedImage.assetId,
        base64: selectedImage.base64,
        duration: selectedImage.duration,
        exif: selectedImage.exif,
        fileName: selectedImage.fileName,
        fileSize: selectedImage.fileSize,
        height: selectedImage.height,
        type: selectedImage.type,
        uri: selectedImage.uri,
        width: selectedImage.width,
      };

      console.log(`UPDATED AVATAR: ${updatedAvatar}`);

      try {
        //@ts-ignore
        dispatch(saveUserData({ ...formData, avatar: updatedAvatar }));
        console.log("Dispatch called");
      } catch {
        console.log("Error saving avatar");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Personal Details</Text>
        <TouchableOpacity onPress={() => handleSave()}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.circle} onPress={addCollection}>
        {avatar?.uri ? (
          <Image source={{ uri: avatar.uri }} style={styles.profileImage} />
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          onFocus={() => handleTextInputFocus("firstName")}
          value={formData.firstName}
          onChangeText={(value) => handleChange("firstName", value)}
          style={styles.textInput}
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          onFocus={() => handleTextInputFocus("lastName")}
          value={formData.lastName}
          onChangeText={(value) => handleChange("lastName", value)}
          style={styles.textInput}
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          onFocus={() => handleTextInputFocus("username")}
          value={formData.username}
          onChangeText={(value) => handleChange("username", value)}
          style={styles.textInput}
        />
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          onFocus={() => handleTextInputFocus("bio")}
          value={formData.bio}
          onChangeText={(value) => handleChange("bio", value)}
          style={[styles.textInput, styles.multilineTextInput]}
          multiline
        />
      </View>
    </SafeAreaView>
  );
};

export default PersonalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  emptyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#e6e6e6",
  },
  backButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 35,

    alignSelf: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  multilineTextInput: {
    height: 80,
    textAlignVertical: "top",
  },
});
