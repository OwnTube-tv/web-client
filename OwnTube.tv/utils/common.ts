import { Dimensions } from "react-native";

export const getThumbnailDimensions = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = screenWidth * 0.25;
  const height = width * 0.6 + 50;

  return { width, height };
};
