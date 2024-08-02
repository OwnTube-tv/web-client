import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { PlayerButton } from "./PlayerButton";
import { ScrubBar } from "./ScrubBar";

interface Props {
  isMute: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const ANIMATION_DURATION = 350;

export const VolumeControl = ({ isMute, volume, toggleMute, setVolume }: Props) => {
  const width = useSharedValue(0);

  const showVolumeBar = () => {
    width.value = withTiming(64, { duration: ANIMATION_DURATION });
  };
  const hideVolumeBar = () => {
    width.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  return (
    <Pressable style={styles.container} onHoverOut={hideVolumeBar}>
      <PlayerButton onPress={toggleMute} icon={`Volume${isMute ? "-Off" : ""}`} onHoverIn={showVolumeBar} />
      <Animated.View style={[styles.animatedContainer, { width: width }]}>
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
