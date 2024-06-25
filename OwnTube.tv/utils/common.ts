import { Dimensions } from "react-native";

export const getThumbnailDimensions = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = screenWidth * 0.25;
  const height = width * 0.6 + 50;

  return { width, height };
};

export const capitalize = (input: string) => {
  return input.charAt(0).toUpperCase() + input.slice(1);
};
