import { StyleSheet } from "react-native";
import { colors } from "../../theme";

export const styles = StyleSheet.create({
  chromecastOverlay: {
    alignItems: "center",
    backgroundColor: colors.dark.black100,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  liveStreamAnnouncementContainer: {
    alignItems: "center",
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  liveStreamOfflineOverlay: { alignItems: "center", flex: 1, justifyContent: "center", zIndex: 1 },
  liveStreamPoster: { bottom: 0, flex: 1, left: 0, position: "absolute", right: 0, top: 0 },
  opacityOverlay: {
    backgroundColor: colors.dark.black50,
    bottom: 0,
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0,
  },
  previewImage: { bottom: 0, flex: 1, left: 0, position: "absolute", right: 0, top: 0 },
  videoWrapper: { flex: 1, height: "100%", pointerEvents: "none", width: "100%", zIndex: 1 },
});
