import { PropsWithChildren, FC } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCategoryScroll } from "../hooks";
import { Button } from "./";
import { useTheme } from "@react-navigation/native";

export const CategoryScroll: FC<PropsWithChildren> = ({ children }) => {
  const { ref, scrollLeft, scrollRight, windowWidth } = useCategoryScroll();
  const { colors } = useTheme();

  return (
    <View style={styles.horizontalScrollContainer}>
      <Button onPress={scrollLeft} style={[styles.scrollButton, { backgroundColor: colors.card }]}>
        <AntDesign name="left" size={20} color={colors.text} />
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

      <Button onPress={scrollRight} style={[styles.scrollButton, { backgroundColor: colors.card }]}>
        <AntDesign name="right" size={20} color={colors.text} />
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
