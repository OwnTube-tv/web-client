import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import VideoThumbnailComponent from "./VideoThumbnailComponent";
import { Video, CategoryLabel } from "../VideoTypes";

const COLORS = {
  DARK: "#333",
  LIGHT_GRAY: "#CCC",
  GRAY: "#ddd",
  WHITE: "#FFF",
};

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
          <Text style={styles.buttonText}>{"<"}</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={(ref) => (scrollRefs.current[0] = ref)}
          contentContainerStyle={[styles.videoThumbnailsContainer, { width: windowWidth }]}
          style={styles.scrollView}
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
          <Text style={styles.buttonText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: COLORS.DARK,
    fontSize: 20,
  },
  categoryTitle: {
    color: COLORS.WHITE,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
    width: "80%",
  },
  horizontalScrollContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  scrollButton: {
    backgroundColor: COLORS.GRAY,
    borderRadius: 10,
    marginHorizontal: 5,
    padding: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  videoThumbnailsContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export default VideosByCategoryComponent;
