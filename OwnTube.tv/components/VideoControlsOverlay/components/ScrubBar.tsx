import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";

interface ScrubBarProps {
  percentageAvailable: number;
  percentagePosition: number;
}

export const ScrubBar = ({ percentageAvailable, percentagePosition }: ScrubBarProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.scrubBarContainer,
        {
          backgroundColor: colors.background,
          borderColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.percentageAvailableBar,
          {
            backgroundColor: colors.border,
            width: `${percentageAvailable}%`,
          },
        ]}
      />
      <View
        style={[
          styles.percentagePositionBar,
          {
            backgroundColor: colors.primary,
            width: `${percentagePosition}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  percentageAvailableBar: {
    height: 3,
    left: 0,
    position: "absolute",
    top: 1,
    zIndex: 1,
  },
  percentagePositionBar: {
    height: 3,
    left: 0,
    position: "absolute",
    top: 1,
    zIndex: 2,
  },
  scrubBarContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    flexDirection: "row",
    height: 5,
    width: "80%",
  },
});
