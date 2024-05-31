import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useState } from "react";

interface ScrubBarProps {
  percentageAvailable: number;
  percentagePosition: number;
  onDrag: (position: number) => void;
  duration: number;
}

const INDICATOR_SIZE = 11;

export const ScrubBar = ({ percentageAvailable, percentagePosition, onDrag, duration }: ScrubBarProps) => {
  const { colors } = useTheme();
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handlePan = (event: PanGestureHandlerEventPayload) => {
    if (visibleWidth < event.x || event.x < 0) {
      return;
    }
    const newPositionRelation = event.x / visibleWidth;

    onDrag(Math.floor(newPositionRelation * duration));
  };

  const pan = Gesture.Pan()
    .onUpdate(handlePan)
    .onStart(() => setIsDragging(true))
    .onEnd(() => setIsDragging(false));

  const scrubberPositionPercentage = percentagePosition - (INDICATOR_SIZE / 2 / visibleWidth) * 100;

  return (
    <GestureHandlerRootView style={styles.gestureHandlerContainer}>
      <GestureDetector gesture={pan}>
        <View collapsable={false} style={styles.scrubBarHitSlop}>
          <View
            style={[
              styles.scrubBarContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.background,
              },
            ]}
            onLayout={(event) => setVisibleWidth(event.nativeEvent.layout.width)}
          >
            <View
              style={[
                styles.indicator,
                {
                  backgroundColor: isDragging ? colors.text : colors.primary,
                  borderColor: colors.background,
                  left: `${scrubberPositionPercentage}%`,
                },
              ]}
            />
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
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    alignItems: "center",
    height: 45,
    position: "relative",
    width: "80%",
  },
  indicator: {
    borderRadius: 12,
    borderWidth: 1,
    height: INDICATOR_SIZE,
    position: "absolute",
    top: -3.5,
    width: INDICATOR_SIZE,
    zIndex: 4,
  },
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
    width: "100%",
  },
  scrubBarHitSlop: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
