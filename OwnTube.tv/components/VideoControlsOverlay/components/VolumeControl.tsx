import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ScrubBar } from "./ScrubBar";
import PlayerButton from "./PlayerButton";

interface Props {
  isMute: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const ANIMATION_DURATION = 350;

export const VolumeControl = ({ isMute, volume, toggleMute, setVolume }: Props) => {
  const isExpanded = useSharedValue(0);

  const showVolumeBar = () => {
    isExpanded.value = 1;
  };
  const hideVolumeBar = () => {
    isExpanded.value = 0;
  };

  const animatedWidthStyle = useAnimatedStyle(() => ({
    width: withTiming(isExpanded.value ? 64 : 0, { duration: ANIMATION_DURATION }),
  }));

  return (
    <Pressable style={styles.container} onHoverOut={hideVolumeBar}>
      <PlayerButton onPress={toggleMute} icon={`Volume${isMute ? "-Off" : ""}`} onHoverIn={showVolumeBar} />
      <Animated.View style={[styles.animatedContainer, animatedWidthStyle]}>
        <View style={styles.scrubBarContainer}>
          <ScrubBar
            variant="volume"
            isExpanded
            length={100}
            onDrag={setVolume}
            percentageAvailable={0}
            percentagePosition={volume}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { height: 48, overflow: "hidden" },
  container: { flexDirection: "row" },
  scrubBarContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    position: "relative",
    width: 52,
    zIndex: 10,
  },
});
