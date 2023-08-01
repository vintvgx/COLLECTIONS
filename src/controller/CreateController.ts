import * as ImagePicker from "expo-image-picker";
import React from "react";
import { ImageCollectionData } from "../model/types";

class CreateController {
  static async ADD_COLLECTION(
    images: ImageData[],
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
      // setImages([...images, { uri: result.uri }]);
    }

    console.log(images);
  }

  static async takePhoto(
    images: ImageData[],
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
      // setImages([...images, { uri: result.uri }]);
    }
  }

  static async handleConfirmButtonPressed(
    images: ImageData[],
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
    setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
    collectionTitle: string,
    currentDateTime: Date,
    dispatch: Function,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    setImageCount: React.Dispatch<React.SetStateAction<number>>
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
          time: currentDateTime.toLocaleTimeString(),
          date: currentDateTime.toLocaleDateString(),
        })),
        title: collectionTitle,
        date: currentDateTime.toLocaleString(),
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

  static handleSaveButtonPress(
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
