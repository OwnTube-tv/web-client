import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Typography } from "../Typography";
import { getHumanReadableDuration } from "../../utils";
import { VolumeControl } from "./components/VolumeControl";
import * as Device from "expo-device";
import { DeviceType } from "expo-device";
import { colors, spacing } from "../../theme";
import { ShareButton } from "./components/ShareButton";
import { TextLink } from "./components/TextLink";
import { ScrubBar } from "./components/ScrubBar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInDown, SlideInUp, SlideOutDown, SlideOutUp, FadeIn, FadeOut } from "react-native-reanimated";
import { ROUTES } from "../../types";
import PlayerButton from "./components/PlayerButton";
import { useVideoControlsOverlay } from "./hooks/useVideoControlsOverlay";
import { ViewOnSiteLink } from "../ViewOnSiteLink";
import { useInstanceConfig } from "../../hooks";
import AvRoutePickerButton from "../AvRoutePickerButton/AvRoutePickerButton";
import { PlaybackSettingsPopup } from "../PlaybackSettingsPopup";
import GoogleCastButton from "../GoogleCastButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChannelLink } from "../ChannelLink";
import { VideoChannelSummary } from "@peertube/peertube-types";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface VideoControlsOverlayProps {
  isVisible: boolean;
  onOverlayPress?: () => void;
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
  channel?: VideoChannelSummary;
  handleVolumeControl: (volume: number) => void;
  volume: number;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  handleOpenDetails: () => void;
  handleShare: () => void;
  handleOpenSettings: () => void;
  videoLinkProps: { url?: string; backend: string };
  handleHideOverlay?: () => void;
  handleSetSpeed: (speed: number) => void;
  speed: number;
  selectedQuality: string;
  handleSetQuality: (quality: string) => void;
  isWebAirPlayAvailable?: boolean;
  isChromeCastAvailable?: boolean;
  castState?: "airPlay" | "chromecast";
  handleLoadGoogleCastMedia?: () => void;
  handleToggleCC?: () => void;
  isCCAvailable: boolean;
  selectedCCLang?: string;
  setSelectedCCLang?: (lang: string) => void;
}

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
  toggleMute,
  isMute = false,
  shouldReplay = false,
  handleReplay,
  handleJumpTo,
  title,
  channel,
  handleVolumeControl,
  volume,
  toggleFullscreen,
  isFullscreen,
  handleOpenDetails,
  handleShare,
  handleOpenSettings,
  videoLinkProps,
  handleHideOverlay,
  handleSetSpeed,
  speed,
  selectedQuality,
  handleSetQuality,
  isWebAirPlayAvailable,
  isChromeCastAvailable,
  castState,
  handleLoadGoogleCastMedia,
  handleToggleCC,
  isCCAvailable,
  selectedCCLang,
  setSelectedCCLang,
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
  const isMobile = Device.deviceType !== DeviceType.DESKTOP;
  const { currentInstanceConfig } = useInstanceConfig();

  const hideVideoSiteLink =
    process.env.EXPO_PUBLIC_HIDE_VIDEO_SITE_LINKS || currentInstanceConfig?.customizations?.hideVideoSiteLinks;

  const insets = useSafeAreaInsets();

  return (
    // @ts-expect-error web cursor options not included in React Native core
    <Pressable style={[styles.overlay, { cursor: isVisible ? "auto" : "none" }]} onPress={onOverlayPress}>
      {isVisible ? (
        <View style={styles.contentContainer} pointerEvents="box-none">
          <Animated.View
            entering={SlideInUp}
            exiting={SlideOutUp}
            style={styles.animatedTopContainer}
            pointerEvents="box-none"
          >
            <LinearGradient
              locations={[0, 0.25, 1]}
              colors={isMobile ? ["#00000000", "#00000000", "#00000000"] : ["#00000080", "#0000004D", "#00000000"]}
              style={[styles.topControlsContainer, ...(isMobile ? [{ paddingTop: spacing.lg }] : [{ height: 360 }])]}
            >
              <View style={styles.topLeftControls} pointerEvents="box-none">
                <PlayerButton onPress={handlePressBack} icon="Arrow-Left" />
                <View style={styles.videoInfoContainer}>
                  <ChannelLink
                    color={colors.white80}
                    text={channel?.displayName || ""}
                    href={{ pathname: ROUTES.CHANNEL, params: { backend: channel?.host, channel: channel?.name } }}
                    sourceLink={channel?.url || ""}
                  />
                  <Typography
                    numberOfLines={4}
                    ellipsizeMode="tail"
                    color={colors.white94}
                    fontWeight="SemiBold"
                    fontSize={isMobile ? "sizeSm" : "sizeLg"}
                    style={{ width: "88%" }}
                  >
                    {title}
                  </Typography>
                  <View accessible={false} style={{ alignSelf: "flex-start" }}>
                    <TextLink text={t("details")} onPress={handleOpenDetails} isMobile={isMobile} />
                  </View>
                </View>
              </View>
              <View style={styles.topRightControls}>
                <ShareButton onPress={handleShare} isMobile={isMobile} />
                <PlayerButton onPress={handleOpenSettings} icon="Kebab-menu" />
              </View>
            </LinearGradient>
          </Animated.View>
          {isMobile && (
            <AnimatedPressable
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.playbackControlsContainer}
              onPress={() => {
                if (isVisible) {
                  handleHideOverlay?.();
                } else {
                  onOverlayPress?.();
                }
              }}
            >
              <PlayerButton onPress={() => handleRW(15)} icon="Rewind-15" />
              <PlayerButton onPress={shouldReplay ? handleReplay : handlePlayPause} icon={centralIconName} />
              <PlayerButton onPress={() => handleFF(30)} icon="Fast-forward-30" />
            </AnimatedPressable>
          )}
          <Animated.View
            exiting={SlideOutDown}
            style={[styles.animatedBottomContainer, { paddingBottom: insets.bottom }]}
            entering={SlideInDown}
            pointerEvents="box-none"
          >
            <LinearGradient
              locations={[0, 0.85, 1]}
              colors={isMobile ? ["#00000000", "#00000000", "#00000000"] : ["#00000000", "#0000004D", "#000000AB"]}
              style={[styles.bottomControlsContainer, ...(isMobile ? [{}] : [{ height: 360 }])]}
            >
              <View style={styles.videoLinkContainer}>
                {isSettingsMenuVisible && (
                  <View style={styles.playbackSettingsContainer}>
                    <PlaybackSettingsPopup
                      handleSetQuality={handleSetQuality}
                      selectedQuality={selectedQuality}
                      handleSetSpeed={handleSetSpeed}
                      selectedSpeed={speed}
                      handleSetCCLang={setSelectedCCLang}
                      selectedCCLang={selectedCCLang}
                    />
                  </View>
                )}
                {!hideVideoSiteLink && !!videoLinkProps?.url && (
                  <ViewOnSiteLink site={videoLinkProps?.backend} url={videoLinkProps?.url} />
                )}
              </View>
              <Pressable
                accessible={false}
                onHoverIn={() => setIsSeekBarFocused(true)}
                onHoverOut={() => setIsSeekBarFocused(false)}
                style={styles.scrubBarContainer}
              >
                <ScrubBar
                  isExpanded={isSeekBarFocused}
                  variant="seek"
                  length={duration}
                  onDrag={handleJumpTo}
                  percentageAvailable={percentageAvailable}
                  percentagePosition={percentagePosition}
                />
              </Pressable>
              <View style={styles.bottomRowContainer}>
                <View style={styles.bottomRowControlsContainer}>
                  {!isMobile && (
                    <>
                      <PlayerButton onPress={shouldReplay ? handleReplay : handlePlayPause} icon={centralIconName} />
                      <PlayerButton onPress={() => handleRW(15)} icon="Rewind-15" />
                      <PlayerButton onPress={() => handleFF(30)} icon="Fast-forward-30" />
                      <VolumeControl
                        setVolume={handleVolumeControl}
                        volume={volume}
                        isMute={isMute}
                        toggleMute={toggleMute}
                      />
                    </>
                  )}
                  <Typography
                    fontSize="sizeXS"
                    fontWeight="Medium"
                    style={[styles.timingContainer, { paddingLeft: isMobile ? spacing.sm : null }]}
                    color={colors.white94}
                  >
                    {`${getHumanReadableDuration(position * 1000)} / ${getHumanReadableDuration(duration * 1000)}`}
                  </Typography>
                </View>
                <View style={styles.functionButtonsContainer}>
                  {castState !== "airPlay" && (
                    <GoogleCastButton
                      isChromeCastAvailable={isChromeCastAvailable}
                      handleLoadGoogleCastMedia={handleLoadGoogleCastMedia}
                    />
                  )}
                  {castState !== "chromecast" && <AvRoutePickerButton isWebAirPlayAvailable={isWebAirPlayAvailable} />}
                  {isCCAvailable && <PlayerButton icon="Closed-Captions" onPress={handleToggleCC} />}
                  <PlayerButton icon="Settings" onPress={() => setIsSettingsMenuVisible((cur) => !cur)} />
                  <PlayerButton onPress={toggleFullscreen} icon={`Fullscreen${isFullscreen ? "-Exit" : ""}`} />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      ) : null}
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  animatedBottomContainer: { bottom: 0, left: 0, position: "absolute", width: "100%" },
  animatedTopContainer: { left: 0, position: "absolute", top: 0, width: "100%", zIndex: 1 },
  bottomControlsContainer: {
    alignItems: "center",
    cursor: "auto",
    justifyContent: "flex-end",
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
  contentContainer: {
    flex: 1,
    height: "100%",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 2,
  },
  functionButtonsContainer: { alignItems: "center", flexDirection: "row" },
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
    gap: spacing.xl,
    height: "100%",
    justifyContent: "center",
    position: "relative",
    width: "100%",
    zIndex: -1,
  },
  playbackSettingsContainer: { bottom: -spacing.xxl, position: "relative", zIndex: 1 },
  scrubBarContainer: { height: spacing.md, width: "100%" },
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
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xl,
    width: "100%",
  },
  topLeftControls: { flexDirection: "row", gap: spacing.sm, maxWidth: 600, width: "60%" },
  topRightControls: { alignItems: "center", flexDirection: "row" },
  videoInfoContainer: { gap: spacing.md, width: "100%" },
  videoLinkContainer: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginBottom: spacing.xl,
  },
});

export default VideoControlsOverlay;
