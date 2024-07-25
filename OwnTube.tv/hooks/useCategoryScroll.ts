import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { GetVideosVideo } from "../api/models";

export const useCategoryScroll = () => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const ref = useRef<FlatList<GetVideosVideo>>(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });

    return () => subscription.remove();
  }, []);

  const scrollLeft = () => ref.current?.scrollToIndex({ index: 0, animated: true });
  const scrollRight = () => ref.current?.scrollToEnd({ animated: true });

  return { ref, windowWidth, scrollRight, scrollLeft };
};
