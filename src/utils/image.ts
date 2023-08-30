import { Dimensions } from "react-native";

export const calculateImageHeight = (
  imageWidth: number,
  imageHeight: number,
  containerWidth?: number
): number => {
  const width = containerWidth || Dimensions.get("window").width;
  const aspectRatio = imageWidth / imageHeight;
  return width / aspectRatio;
};
