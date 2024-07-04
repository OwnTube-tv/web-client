import { PropsWithChildren, useMemo } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { ScrubBar } from "./components/ScrubBar";
import { Typography } from "../Typography";
import { getHumanReadableDuration } from "../../utils";
import { typography } from "../../theme";
import { useNavigation } from "expo-router";
import { DeviceCapabilitiesModal } from "../DeviceCapabilitiesModal";

interface VideoControlsOverlayProps {
  isVisible: boolean;
  onOverlayPress: () => void;
  isPlaying?: boolean;
  handlePlayPause: () => void;
  handleRW: (s: number) => void;
  handleFF: (s: number) => void;
  duration?: number;
  availableDuration?: number;
  position?: number;
  toggleMute: () => void;
  isMute?: boolean;
  shouldReplay?: boolean;
  handleReplay: () => void;
  handleJumpTo: (position: number) => void;
  title?: string;
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
  handleJumpTo,
  title,
}: PropsWithChildren<VideoControlsOverlayProps>) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const uiScale = useMemo(() => {
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
            <View style={styles.topLeftControls}>
              <Pressable onPress={navigation.goBack} style={styles.goBackContainer}>
                <Ionicons name={"arrow-back"} size={48 * uiScale} color={colors.primary} />
              </Pressable>
              <Typography
                numberOfLines={1}
                ellipsizeMode="tail"
                color={colors.primary}
                fontSize={48 * uiScale}
                style={styles.title}
              >
                {title}
              </Typography>
            </View>
            <View style={styles.topRightControls}>
              <Pressable onPress={toggleMute}>
                <Ionicons name={`volume-${isMute ? "mute" : "high"}`} size={48 * uiScale} color={colors.primary} />
              </Pressable>
              <DeviceCapabilitiesModal />
            </View>
          </View>
          <View style={styles.playbackControlsContainer}>
            <View style={{ flexDirection: "row", gap: 32 * uiScale }}>
              <Pressable onPress={() => handleRW(15)}>
                <View style={styles.skipTextContainer}>
                  <Typography color={colors.primary} fontSize={32 * uiScale} style={styles.skipText}>
                    {15}
                  </Typography>
                </View>
                <Ionicons name={"reload"} size={96 * uiScale} color={colors.primary} style={styles.skipLeft} />
              </Pressable>
              <Pressable onPress={shouldReplay ? handleReplay : handlePlayPause}>
                <Ionicons name={centralIconName} size={96 * uiScale} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => handleFF(30)}>
                <View style={styles.skipTextContainer}>
                  <Typography color={colors.primary} fontSize={32 * uiScale} style={styles.skipText}>
                    {30}
                  </Typography>
                </View>
                <Ionicons name={"reload"} size={96 * uiScale} color={colors.primary} style={styles.skipRight} />
              </Pressable>
            </View>
          </View>
          <Pressable style={styles.bottomControlsContainer}>
            <Typography hasOuterGlow fontSize={typography.size.M * uiScale} style={styles.timeBlockLeft}>
              {getHumanReadableDuration(position)}
            </Typography>
            <ScrubBar
              duration={duration}
              onDrag={handleJumpTo}
              percentageAvailable={percentageAvailable}
              percentagePosition={percentagePosition}
            />
            <Typography hasOuterGlow fontSize={typography.size.M * uiScale} style={styles.timeBlockRight}>
              {getHumanReadableDuration(duration)}
            </Typography>
          </Pressable>
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
    flexDirection: "row",
    height: "20%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    width: "100%",
  },
  contentContainer: { flex: 1, height: "100%", left: 0, position: "absolute", top: 0, width: "100%", zIndex: 1 },
  goBackContainer: { justifyContent: "center" },
  overlay: {
    alignItems: "center",
    alignSelf: "center",
    cursor: "auto",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  playbackControlsContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  skipLeft: {
    transform: [{ rotateZ: "45deg" }, { scaleX: -1 }],
  },
  skipRight: {
    transform: [{ rotateZ: "-45deg" }],
  },
  skipText: { fontWeight: "bold", marginTop: 4, userSelect: "none" },
  skipTextContainer: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  timeBlockLeft: {
    left: "3%",
    position: "absolute",
    userSelect: "none",
  },
  timeBlockRight: {
    position: "absolute",
    right: "3%",
    userSelect: "none",
  },
  title: { fontWeight: "bold" },
  topControlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "20%",
    justifyContent: "space-between",
    left: 0,
    paddingHorizontal: "5%",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  topLeftControls: { flexDirection: "row", gap: 24, width: "80%" },
  topRightControls: { alignItems: "center", flexDirection: "row", gap: 24, width: "10%" },
});
