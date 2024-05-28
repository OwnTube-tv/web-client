import { PropsWithChildren, useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { ScrubBar } from "./components/ScrubBar";

interface VideoControlsOverlayProps {
  isVisible: boolean;
  onOverlayPress: () => void;
  isPlaying?: boolean;
  handlePlayPause: () => void;
  handleRW: () => void;
  handleFF: () => void;
  duration?: number;
  availableDuration?: number;
  position?: number;
  toggleMute: () => void;
  isMute?: boolean;
  shouldReplay?: boolean;
  handleReplay: () => void;
}

export const VideoControlsOverlay = ({
  children,
  isVisible,
  onOverlayPress,
  isPlaying,
  handlePlayPause,
  handleRW,
  handleFF,
  duration = 1,
  availableDuration = 0,
  position = 0,
  toggleMute,
  isMute = false,
  shouldReplay,
  handleReplay,
}: PropsWithChildren<VideoControlsOverlayProps>) => {
  const { colors } = useTheme();

  const buttonScale = useMemo(() => {
    const { width, height } = Dimensions.get("window");
    const isHorizontal = width > height;

    return isHorizontal ? 1 : 0.5;
  }, []);

  const centralIconName = useMemo(() => {
    return isPlaying ? "pause" : shouldReplay ? "reload" : "play";
  }, [isPlaying, shouldReplay]);

  const { percentageAvailable, percentagePosition } = useMemo(() => {
    return {
      percentageAvailable: (availableDuration / duration) * 100,
      percentagePosition: (position / duration) * 100,
    };
  }, [availableDuration, duration, position]);

  return (
    <Pressable style={styles.overlay} onPress={onOverlayPress}>
      {isVisible ? (
        <View style={styles.contentContainer}>
          <View style={styles.topControlsContainer}>
            <Pressable onPress={toggleMute}>
              <Ionicons name={`volume-${isMute ? "mute" : "high"}`} size={48 * buttonScale} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.playbackControlsContainer}>
            <View style={{ flexDirection: "row", gap: 48 * buttonScale }}>
              <Pressable onPress={handleRW}>
                <Ionicons name={"play-back"} size={96 * buttonScale} color={colors.primary} />
              </Pressable>
              <Pressable onPress={shouldReplay ? handleReplay : handlePlayPause}>
                <Ionicons name={centralIconName} size={96 * buttonScale} color={colors.primary} />
              </Pressable>
              <Pressable onPress={handleFF}>
                <Ionicons name={"play-forward"} size={96 * buttonScale} color={colors.primary} />
              </Pressable>
            </View>
          </View>
          <View style={styles.bottomControlsContainer}>
            <ScrubBar percentageAvailable={percentageAvailable} percentagePosition={percentagePosition} />
          </View>
        </View>
      ) : null}
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bottomControlsContainer: {
    alignItems: "center",
    bottom: 0,
    height: "20%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    width: "100%",
  },
  contentContainer: { flex: 1, height: "100%", left: 0, position: "absolute", top: 0, width: "100%", zIndex: 1 },
  overlay: {
    alignSelf: "center",
    maxHeight: "100%",
    maxWidth: "100%",
  },
  playbackControlsContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  topControlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    justifyContent: "flex-end",
    left: 0,
    paddingRight: "5%",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
});
