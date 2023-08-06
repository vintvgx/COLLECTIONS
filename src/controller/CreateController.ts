import * as ImagePicker from "expo-image-picker";
import React from "react";
import { ImageCollectionData, ImageData } from "../model/types";
import { addCollectionData } from "../redux_toolkit/slices/addCollectionSlice";

class CreateController {
  static async ADD_COLLECTION(
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>
  ) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  }

  static async TAKE_PHOTO(
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>
  ) {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20 - images.length,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  }

  static async HANDLE_CONFIRM_BUTTON_PRESSED(
    images: ImageData[],
    collectionTitle: string,
    setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
    setImageCount: React.Dispatch<React.SetStateAction<number>>,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
    currentTimestamp: string, // Adjust the type as necessary
    dispatch: Function
  ) {
    if (images.length === 0) {
      return;
    }

    try {
      const dataState: ImageCollectionData = {
        image: images.map((image, index) => ({
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
      } else {
        // @ts-ignore
        await dispatch(addCollectionData(dataState));
        setCollectionTitle("");
        setImageCount(0);
        setShowModal(false);
        setImages([]);
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
}

export default CreateController;
