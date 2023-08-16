import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import CreateController from "../../controller/CreateController";
import { ImageData } from "../../model/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigation/Navigation";
import AddCollectionView from "./AddCollectionView";

type CreatorTypes = {
  images: ImageData[];
};

const CreatorView: React.FC<CreatorTypes> = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const [images, setImages] = useState<ImageData[]>([]);
  const [cover, setCover] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [loading, setLoadingImages] = useState(false);

  const currentDateTime = new Date();
  const currentTimestamp = new Date().toISOString();

  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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

  const takePhoto = async () => {
    const takenImages = await CreateController.TAKE_PHOTO();

    if (takenImages) {
      navigation.navigate("AddCollectionView", { images: takenImages });
    }
  };

  const addCollection = async () => {
    setLoadingImages(true);
    const selectedImages = await CreateController.ADD_COLLECTION();
    if (selectedImages) {
      console.log("CreatorViewIMAGES_SELECTED:", selectedImages);

      // After adding to the collection, navigate to the AddCollectionView
      navigation.navigate("AddCollectionView", { images: selectedImages });
    }
    setLoadingImages(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              flex: 5,
            }}
            onPress={addCollection}>
            <SafeAreaView
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000", // Set the shadow color to black
                shadowOffset: { width: 0, height: 2 }, // Set the shadow offset
                shadowOpacity: 0.5, // Set the shadow opacity
                // elevation: 2, // Set the elevation for Android
              }}>
              <Image
                source={require("../../../assets/stature.jpg")}
                style={{
                  flexGrow: 1,

                  alignItems: "center",
                  justifyContent: "center",
                  height: "30%",
                  width: "90%",
                  borderRadius: 5,
                }}
              />

              <Text
                style={{
                  textAlign: "center",
                  position: "absolute",
                  fontSize: 50,
                  color: "white",
                  top: "20%",
                  width: "95%",
                }}>
                Collection+
              </Text>
            </SafeAreaView>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 150,
              height: 50,
              margin: 20,
              backgroundColor: "#212121", // Set the background color to dark gray
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 15,
              shadowColor: "#000", // Set the shadow color to black
              shadowOffset: { width: 0, height: 2 }, // Set the shadow offset
              shadowOpacity: 0.5, // Set the shadow opacity
              shadowRadius: 2, // Set the shadow radius
              elevation: 2, // Set the elevation for Android
              justifyContent: "center",
              alignSelf: "center",
              alignItems: "center",
            }}
            onPress={takePhoto}>
            <Text style={{ color: "white" }}>Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreatorView;

const styles = StyleSheet.create({
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatlist_container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: Dimensions.get("window").width / 4.5,
    height: Dimensions.get("window").height / 10,
    padding: 0,
    margin: 5,
    marginTop: 30,
    overflow: "hidden",
  },
  flatlist_image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    // borderWidth:2,
    // borderColor:'#d35647',
    zIndex: -1,
  },
  cover_image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    aspectRatio: 1,
    resizeMode: "contain",
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    //TODO: Add blur effect to background
    // backdropFilter: "blur(5px)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 10,
    elevation: 5,
    width: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20, // Place it to the left of the screen
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    // backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "black",
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  confirmButtonText: {
    color: "white",
  },
});
