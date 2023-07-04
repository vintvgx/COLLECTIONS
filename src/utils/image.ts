import { Dimensions } from "react-native";

export const calculateImageHeight = (
  imageWidth: number,
  imageHeight: number
): number => {
  const screenWidth = Dimensions.get("window").width;
  const aspectRatio = imageWidth / imageHeight;
  return screenWidth / aspectRatio;
};
