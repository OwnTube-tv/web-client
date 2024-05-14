import { PropsWithChildren, FC } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCategoryScroll } from "../hooks";
import { Button } from "./";

export const CategoryScroll: FC<PropsWithChildren> = ({ children }) => {
  const { ref, scrollLeft, scrollRight, windowWidth } = useCategoryScroll();

  return (
    <View style={styles.horizontalScrollContainer}>
      <Button onPress={scrollLeft} style={styles.scrollButton}>
        <AntDesign name="left" size={20} color="black" />
      </Button>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={ref}
        contentContainerStyle={styles.videoThumbnailsContainer}
        style={[styles.scrollView, { width: windowWidth - 120 }]}
      >
        {children}
      </ScrollView>

      <Button onPress={scrollRight} style={styles.scrollButton}>
        <AntDesign name="right" size={20} color="black" />
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalScrollContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollButton: {
    alignItems: "center",
    // backgroundColor: theme.colors.gray,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginHorizontal: 5,
    width: 40,
  },
  scrollView: {
    flexGrow: 0,
    overflow: "visible",
  },
  videoThumbnailsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
