import { forwardRef, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useTVEventHandler,
  useWindowDimensions,
  TVFocusGuideView,
  Platform,
  BackHandler,
} from "react-native";
import { Typography } from "../Typography";
import { getHumanReadableDuration } from "../../utils";
import { borderRadius, colors, spacing } from "../../theme";
import { ShareButton } from "./components/ShareButton";
import { TextLink } from "./components/TextLink";
import { ScrubBar } from "./components/ScrubBar";
import { LinearGradient } from "expo-linear-gradient";
import { ROUTES } from "../../types";
import PlayerButton from "./components/PlayerButton";
import { VideoControlsOverlayProps } from "./VideoControlsOverlay";
import { useVideoControlsOverlay } from "./hooks/useVideoControlsOverlay";
import { useFocusEffect } from "expo-router";
import { PlaybackSettingsPopup } from "../PlaybackSettingsPopup";
import { ChannelLink } from "../ChannelLink";

const AndroidFocusHelperContainer = forwardRef<View, PropsWithChildren<{ isVisible: boolean; onPress?: () => void }>>(
  ({ isVisible, onPress, children }, ref) => {
    return Platform.select({
      android: (
        <Pressable hasTVPreferredFocus style={styles.overlay} ref={ref}>
          {children}
        </Pressable>
      ),
      default: (
        <Pressable isTVSelectable={!isVisible} onPress={onPress} style={styles.overlay} ref={ref}>
          {children}
        </Pressable>
      ),
    });
  },
);

AndroidFocusHelperContainer.displayName = "AndroidFocusHelperContainer";

const INTERFACE_SCALE = Platform.isTVOS ? 3 : 1;

const VideoControlsOverlay = ({
  children,
  isVisible,
  onOverlayPress,
  isPlaying = false,
  handlePlayPause,
  handleRW,
  handleFF,
  duration = 1,
  availableDuration = 0,
  position = 0,
  shouldReplay = false,
  handleReplay,
  handleJumpTo,
  title,
  channel,
  handleOpenDetails,
  handleShare,
  handleOpenSettings,
  handleHideOverlay,
  handleSetSpeed,
  speed,
  selectedQuality,
  handleSetQuality,
  handleToggleCC,
  isCCAvailable,
}: PropsWithChildren<VideoControlsOverlayProps>) => {
  const {
    isSeekBarFocused,
    setIsSeekBarFocused,
    handlePressBack,
    percentageAvailable,
    percentagePosition,
    centralIconName,
    t,
    colors,
    router,
    isSettingsMenuVisible,
    setIsSettingsMenuVisible,
  } = useVideoControlsOverlay({
    isPlaying,
    shouldReplay,
    availableDuration,
    duration,
    position,
    isVisible,
  });

  const [backRef, setBackRef] = useState<number | undefined>();
  const [detailsRef, setDetailsRef] = useState<number | undefined>();
  const [shareBtnRef, setShareBtnRef] = useState<number | undefined>();
  const containerRef = useRef<View | null>(null);
  const settingsRef = useRef<View | null>(null);

  const { height } = useWindowDimensions();

  useEffect(() => {
    containerRef.current?.requestTVFocus();
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setIsSeekBarFocused(false);
    }
  }, [isVisible]);
  const [longPressScrubMode, setLongPressScrubMode] = useState<"FF" | "RW" | null>(null);

  const handleBackButton = () => {
    if (isVisible) {
      handleHideOverlay?.();
    } else {
      router.back();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (Platform.OS === "android") {
          handleBackButton();
        }
        return true;
      });

      return () => backHandler.remove();
    }, [handleBackButton]),
  );

  useTVEventHandler(async (event) => {
    if (!["blur", "focus", "menu"].includes(event.eventType)) {
      onOverlayPress?.();
    }

    switch (event.eventType) {
      case "menu":
        handleBackButton();
        break;

      case "playPause":
        handlePlayPause();
        break;

      case "right":
        if (isSeekBarFocused) {
          handleFF(30);
        }
        break;

      case "left":
        if (isSeekBarFocused) {
          handleRW(15);
        }
        break;

      case "longRight":
        setLongPressScrubMode((prev) => (!prev ? "FF" : null));
        break;

      case "longLeft":
        setLongPressScrubMode((prev) => (!prev ? "RW" : null));
        break;

      default:
        break;
    }
  });

  useEffect(() => {
    let isActive = true;
    let seekTime = 10;

    const scrubWithLongPress = () => {
      if (!isActive || !longPressScrubMode || !isSeekBarFocused) return;

      onOverlayPress?.();

      const scrubFn = longPressScrubMode === "FF" ? handleFF : handleRW;
      scrubFn(seekTime);

      seekTime *= 1.1;

      setTimeout(scrubWithLongPress, 300);
    };

    if (longPressScrubMode) {
      isActive = true;
      scrubWithLongPress();
    }

    return () => {
      isActive = false;
    };
  }, [longPressScrubMode]);

  return (
    <AndroidFocusHelperContainer onPress={onOverlayPress} isVisible={isVisible} ref={containerRef}>
      <View style={styles.videoContainer}>{children}</View>
      {isVisible && (
        <View style={[styles.contentContainer, { height }]}>
          <View style={styles.animatedTopContainer}>
            <LinearGradient
              locations={[0, 0.25, 1]}
              colors={["#00000080", "#0000004D", "#00000000"]}
              style={styles.topControlsContainer}
            >
              <TVFocusGuideView style={styles.topLeftControls}>
                <PlayerButton
                  nextFocusRight={detailsRef}
                  ref={(node) => setBackRef(node)}
                  onPress={handlePressBack}
                  icon="Arrow-Left"
                />
                <View style={styles.videoInfoContainer}>
                  <ChannelLink
                    enableOnTV
                    color={colors.white80}
                    text={channel?.displayName || ""}
                    href={{ pathname: ROUTES.CHANNEL, params: { backend: channel?.host, channel: channel?.name } }}
                    sourceLink={channel?.url || ""}
                    nextFocusRight={shareBtnRef}
                  />
                  <Typography
                    numberOfLines={4}
                    ellipsizeMode="tail"
                    color={colors.white94}
                    fontWeight="SemiBold"
                    fontSize={"sizeLg"}
                    style={{ width: "88%" }}
                  >
                    {title}
                  </Typography>
                  <View style={{ alignSelf: "flex-start" }}>
                    <TextLink
                      ref={(node) => setDetailsRef(node)}
                      text={t("details")}
                      onPress={handleOpenDetails}
                      isMobile={false}
                      nextFocusRight={shareBtnRef}
                      nextFocusLeft={backRef}
                    />
                  </View>
                </View>
              </TVFocusGuideView>
              <View style={styles.topRightControls}>
                <ShareButton
                  nextFocusLeft={detailsRef}
                  ref={(node) => setShareBtnRef(node)}
                  onPress={handleShare}
                  isMobile={false}
                />
                <PlayerButton onPress={handleOpenSettings} icon="Settings" />
              </View>
            </LinearGradient>
          </View>
          <View style={styles.playbackControlsContainer}>
            <TVFocusGuideView autoFocus trapFocusRight trapFocusLeft style={styles.centerControlsContainer}>
              <PlayerButton
                scale={INTERFACE_SCALE}
                nextFocusUp={backRef}
                onPress={() => handleRW(15)}
                icon="Rewind-15"
              />
              <PlayerButton
                scale={INTERFACE_SCALE}
                nextFocusUp={backRef}
                hasTVPreferredFocus
                onPress={shouldReplay ? handleReplay : handlePlayPause}
                icon={centralIconName}
              />
              <PlayerButton
                scale={INTERFACE_SCALE}
                nextFocusUp={backRef}
                onPress={() => handleFF(30)}
                icon="Fast-forward-30"
              />
            </TVFocusGuideView>
            {isSettingsMenuVisible && (
              <View style={styles.playbackSettingsContainer}>
                <PlaybackSettingsPopup
                  handleSetQuality={handleSetQuality}
                  selectedQuality={selectedQuality}
                  handleSetSpeed={handleSetSpeed}
                  selectedSpeed={speed}
                  onSelectOption={() => {
                    setIsSettingsMenuVisible(false);
                    settingsRef.current?.requestTVFocus();
                  }}
                />
              </View>
            )}
          </View>
          <View style={styles.animatedBottomContainer} pointerEvents="box-none">
            <LinearGradient
              locations={[0, 0.85, 1]}
              colors={["#00000000", "#0000004D", "#000000AB"]}
              style={styles.bottomControlsContainer}
            >
              <Pressable
                tvParallaxProperties={{ enabled: false }}
                onFocus={() => setIsSeekBarFocused(true)}
                onBlur={() => setIsSeekBarFocused(false)}
                style={({ focused }) => [styles.scrubBarContainer, { borderWidth: focused ? 1 : 0 }]}
              >
                <ScrubBar
                  isExpanded={isSeekBarFocused}
                  variant="seek"
                  length={duration}
                  onDrag={handleJumpTo}
                  percentageAvailable={percentageAvailable}
                  percentagePosition={percentagePosition}
                  onUpdate={onOverlayPress}
                />
              </Pressable>
              <View style={styles.bottomRowContainer}>
                <View style={styles.bottomRowControlsContainer}>
                  <Typography
                    fontSize="sizeXS"
                    fontWeight="Medium"
                    style={styles.timingContainer}
                    color={colors.white94}
                  >
                    {`${getHumanReadableDuration(position * 1000)} / ${getHumanReadableDuration(duration * 1000)}`}
                  </Typography>
                </View>
                <TVFocusGuideView style={{ flexDirection: "row" }}>
                  {isCCAvailable && <PlayerButton icon="Closed-Captions" onPress={handleToggleCC} />}
                  <PlayerButton
                    ref={settingsRef}
                    icon="Settings"
                    onPress={() => setIsSettingsMenuVisible((cur) => !cur)}
                  />
                </TVFocusGuideView>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </AndroidFocusHelperContainer>
  );
};

const styles = StyleSheet.create({
  animatedBottomContainer: { overflow: "visible", width: "100%" },
  animatedTopContainer: { width: "100%" },
  bottomControlsContainer: {
    alignItems: "center",
    cursor: "auto",
    justifyContent: "flex-end",
    maxHeight: 360,
    overflow: "visible",
    paddingHorizontal: spacing.sm,
    width: "100%",
  },
  bottomRowContainer: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  bottomRowControlsContainer: { alignItems: "center", flexDirection: "row" },
  centerControlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xl,
    justifyContent: "center",
    width: "100%",
  },
  contentContainer: {
    backgroundColor: colors.dark.black50,
    flex: 0,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },
  overlay: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.dark.black100,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  playbackControlsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
  playbackSettingsContainer: { bottom: spacing.xs, position: "absolute", right: spacing.xs },
  scrubBarContainer: {
    borderColor: colors.light.white94,
    borderRadius: borderRadius.radiusSm,
    height: spacing.md,
    width: "100%",
  },
  timingContainer: {
    height: 48,
    justifyContent: "center",
    lineHeight: 48,
    textAlign: "center",
    textAlignVertical: "center",
    userSelect: "none",
  },
  topControlsContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.lg,
    justifyContent: "space-between",
    maxHeight: 360,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    width: "100%",
  },
  topLeftControls: { flexDirection: "row", gap: spacing.sm, maxWidth: 600, width: "60%" },
  topRightControls: { alignItems: "center", flexDirection: "row" },
  videoContainer: {
    flex: 0,
    height: "100%",
    width: "100%",
  },
  videoInfoContainer: { gap: spacing.md, width: "100%" },
});

export default VideoControlsOverlay;
