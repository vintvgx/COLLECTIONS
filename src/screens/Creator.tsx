import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { useNavigation } from "@react-navigation/native";

import AddToCollectionButton from "../components/AddToCollectionButton";

type ImageData = { uri: string };

const Create: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [cover, setCover] = useState("");
  // const navigation = useNavigation();
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParams>>();

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

  const addCollection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      setImages(result.assets);
      // setImages([...images, { uri: result.uri }]);
    }

    console.log(images);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20 - images.length,
    });

    if (!result.canceled) {
      setImages(result.assets);
      // setImages([...images, { uri: result.uri }]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {images.length == 0 ? (
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
                source={require("../../assets/stature.jpg")}
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
                  fontSize: 50,
                  color: "white",
                  width: "95%",
                  position: "absolute",
                  top: 20,
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
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Image source={{ uri: cover }} style={styles.cover_image} />
          </View>
          <View>
            <FlatList
              pagingEnabled
              horizontal
              showsHorizontalScrollIndicator={false}
              data={images}
              renderItem={({ item }) => (
                <View style={styles.flatlist_container}>
                  <TouchableOpacity
                    onPress={() => {
                      setCover(item.uri);
                    }}>
                    <Image
                      source={{ uri: item.uri }}
                      // keyExtractor={(item, index) => item.fileName}
                      style={styles.flatlist_image}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
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
});
