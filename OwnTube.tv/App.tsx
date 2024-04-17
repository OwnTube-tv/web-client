import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, ScrollView, TouchableOpacity, Modal, ScaledSize } from "react-native";
import VideoService from "./lib/videoServices";
import MainPageComponent from "./components/MainPageComponent";
import { Video, CategoryLabel } from "./VideoTypes";
import build_info from "./build-info.json";

// Define color constants to avoid literals
const COLORS = {
  white: "#fff",
  modalBackground: "rgba(0,0,0,0.7)",
  overlay: "rgba(0, 0, 0, 0.5)",
};

const App = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<CategoryLabel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState(Dimensions.get("window"));
  const [showBuildInfoModal, setShowBuildInfoModal] = useState(false);

  useEffect(() => {
    const videoService = new VideoService();

    const fetchData = async () => {
      try {
        videoService.loadVideosFromJson();
        const categoriesData = videoService.getVideoCategoryLabels();
        setCategories(categoriesData.map((label, index) => ({ id: index, label })));
        const videosData = videoService.completeThumbnailUrls();
        setVideos(videosData);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      }
    };

    fetchData();

    const onChange = ({ window }: { window: ScaledSize }) => {
      setScreenSize(window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription.remove();
  }, []);

  const showBuildInfo = () => {
    setShowBuildInfoModal(true);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { padding: screenSize.width * 0.0 }]}>
        {categories.length > 0 ? (
          <MainPageComponent videos={videos} categories={categories} />
        ) : (
          <Text style={styles.loadingText}>Loading videos...</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.infoButton} onPress={showBuildInfo}>
        <Text style={styles.infoButtonText}>ℹ️</Text>
      </TouchableOpacity>
      <Modal
        visible={showBuildInfoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBuildInfoModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Build Information:</Text>
            <Text style={styles.modalText}>GITHUB_ACTOR: {build_info.GITHUB_ACTOR}</Text>
            <Text style={styles.modalText}>GITHUB_SHA_SHORT: {build_info.GITHUB_SHA_SHORT}</Text>
            <Text style={styles.modalText}>COMMIT_URL: {build_info.COMMIT_URL}</Text>
            <Text style={styles.modalText}>BUILD_TIMESTAMP: {build_info.BUILD_TIMESTAMP}</Text>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowBuildInfoModal(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  errorContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  infoButton: {
    backgroundColor: COLORS.modalBackground,
    borderRadius: 20,
    bottom: 10,
    padding: 10,
    position: "absolute",
    right: 10,
  },
  infoButtonText: {
    color: COLORS.white,
    fontSize: 20,
  },
  loadingText: {
    fontSize: 20,
    margin: 10,
    textAlign: "center",
  },
  modalCloseButton: {
    backgroundColor: COLORS.modalBackground,
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  modalCloseButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: COLORS.overlay,
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    overflow: "scroll",
  },
});

export default App;
