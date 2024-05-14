import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView } from "react-native";

type ScrollRef = ScrollView | null;

export const useCategoryScroll = () => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const scrollRefs = useRef<ScrollRef[]>([]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => subscription.remove();
  }, []);

  const scrollLeft = () => scrollRefs.current[0]?.scrollTo({ x: 0, animated: true });
  const scrollRight = () => scrollRefs.current[0]?.scrollToEnd({ animated: true });

  const ref = (ref: ScrollRef) => (scrollRefs.current[0] = ref);

  return { ref, scrollLeft, scrollRight, windowWidth };
};
