import { useWindowDimensions } from "react-native";

export const useBreakpoints = () => {
  const { width } = useWindowDimensions();

  return { isDesktop: width > 959, isMobile: width <= 600, isTablet: width <= 959 && width > 600 };
};
