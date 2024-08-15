import { useWindowDimensions } from "react-native";

export const useBreakpoints = () => {
  const { width } = useWindowDimensions();

  return { isDesktop: width > 959 };
};
