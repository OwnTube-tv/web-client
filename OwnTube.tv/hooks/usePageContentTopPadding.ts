import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBreakpoints } from "./useBreakpoints";

export const usePageContentTopPadding = () => {
  const { top } = useSafeAreaInsets();
  const { isMobile } = useBreakpoints();

  return { top: isMobile ? 0 : top };
};
