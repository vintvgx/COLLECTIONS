import { Animated } from "react-native";
import { ImageCollectionData } from "../model/types";

/**
 * Converts the collection data to be displayed in MasonryList
 *
 * @used Profile.tsx
 * @param collectionCovers
 * @returns
 */
export function convertDataForMasonryList(
  collectionCovers: ImageCollectionData[] | undefined
) {
  const formattedData: any[] = [];

  if (collectionCovers) {
    for (let index = 0; index < collectionCovers.length; index++) {
      const item = collectionCovers[index];
      const width = Math.floor(Math.random() * 2) + 1; // Random width between 1 and 2
      const height = Math.floor(Math.random() * 2) + 1; // Random height between 1 and 2
      const randomBool = Math.random() < 0.5;

      formattedData.push({
        id: index.toString(),
        ...item,
        width,
        height,
        randomBool,
      });
    }
  } else {
    return [];
  }

  return formattedData;
}

export const handleSaveButtonPress = (
  setCollectionTitle: React.Dispatch<React.SetStateAction<string>>,
  setImageCount: React.Dispatch<React.SetStateAction<number>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  images: ImageData[]
) => {
  console.log("save pressed");
  setCollectionTitle("");
  setImageCount(images.length);
  setShowModal(true);
};

export function logFeedData(collection: ImageCollectionData[] | undefined) {
  console.log("FEED DATA:", JSON.stringify(collection, null, 2));
}

export const getHeaderHeight = (scrollY: Animated.Value) => {
  return scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 0],
    extrapolate: "clamp",
  });
};

export const getTitleOpacity = (scrollY: Animated.Value) => {
  return scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
};

export const getHeaderTitleFade = (scrollY: Animated.Value) => {
  return scrollY.interpolate({
    inputRange: [190, 300],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
};

export const getTitleMarginLeft = (scrollY: Animated.Value) => {
  return scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 0], // Adjust if necessary based on screen width and text width
    extrapolate: "clamp",
  });
};
