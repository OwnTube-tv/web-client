import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import VideoThumbnailComponent from "./VideoThumbnailComponent";
import { Video, CategoryLabel } from "../VideoTypes";
import { theme } from "../colors";

interface VideosByCategoryComponentProps {
  category: CategoryLabel;
  videos: Video[];
}

const VideosByCategoryComponent: React.FC<VideosByCategoryComponentProps> = ({ category, videos }) => {
  const scrollRefs = useRef<Array<ScrollView | null>>([]);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category.label}</Text>
      <View style={styles.horizontalScrollContainer}>
        <TouchableOpacity
          onPress={() => scrollRefs.current[0]?.scrollTo({ x: 0, animated: true })}
          style={styles.scrollButton}
        >
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={(ref) => (scrollRefs.current[0] = ref)}
          contentContainerStyle={styles.videoThumbnailsContainer}
          style={[styles.scrollView, { width: windowWidth - 120 }]} 
        >
          {videos
            .filter((video) => video.category.label === category.label)
            .map((video) => (
              <VideoThumbnailComponent key={video.id} video={video} />
            ))}
        </ScrollView>
        <TouchableOpacity
          onPress={() => scrollRefs.current[0]?.scrollToEnd({ animated: true })}
          style={styles.scrollButton}
        >
          <Text style={styles.buttonText}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: theme.colors.dark,
    fontSize: 16,
  },
  categoryTitle: {
    fontSize: 24, 
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.white,
  },
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5, 
    backgroundColor: theme.colors.darkGray,
  },
  horizontalScrollContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollButton: {
    alignItems: "center",
    backgroundColor: theme.colors.gray,
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
    paddingRight: 10, 
  },
});

export default VideosByCategoryComponent;
