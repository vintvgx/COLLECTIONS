import * as ImagePicker from "expo-image-picker";
import React from "react";
import { ImageCollectionData, ImageData } from "../model/types";
import { addCollectionData } from "../redux_toolkit/slices/addCollectionSlice";

class CreateController {
  static async ADD_COLLECTION() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      return result.assets;
    } else return;
  }

  static async TAKE_PHOTO() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      return result.assets;
    } else return;
  }

  static async HANDLE_CONFIRM_BUTTON_PRESSED(
    images: ImageData[],
    collectionTitle: string,
    setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
    setImageCount: React.Dispatch<React.SetStateAction<number>>,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    currentTimestamp: string, // Adjust the type as necessary
    dispatch: Function
  ) {
    if (images.length === 0) {
      return;
    }

    try {
      const sortedImages = images.sort((a, b) => a.id - b.id);

      const dataState: ImageCollectionData = {
        image: sortedImages.map((image, index) => ({
          ...image,
          id: index,
          title: collectionTitle,
          createdAt: currentTimestamp,
        })),
        title: collectionTitle,
        createdAt: currentTimestamp,
      };

      if (collectionTitle == "") {
        console.log("ENTER TITLE U DWEEB!");
        alert("So we just not gone put a title?");
      } else {
        // @ts-ignore
        await dispatch(addCollectionData(dataState));
        setCollectionTitle("");
        setImageCount(0);
        setShowModal(false);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  static HANDLE_SAVE_BUTTON_PRESSED(
    images: ImageData[],
    setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
    setImageCount: React.Dispatch<React.SetStateAction<number>>,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setCollectionTitle("");
    setImageCount(images.length);
    setShowModal(true);
  }

  static HANDLE_BACK_BUTTON_PRESSED(navigation: any) {
    navigation.goBack();
  }
}

export default CreateController;
