import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";

interface ScrubBarProps {
  percentageAvailable: number;
  percentagePosition: number;
  onDrag: (position: number) => void;
  duration: number;
}

const INDICATOR_SIZE = 16;

export const ScrubBar = ({ percentageAvailable, percentagePosition, onDrag, duration }: ScrubBarProps) => {
  const { colors } = useTheme();
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const handlePan = (event: PanGestureHandlerEventPayload) => {
    if (visibleWidth < event.x || event.x < 0) {
      return;
    }

    setScrubberPosition(event.x - INDICATOR_SIZE / 2);
  };

  const setPosition = (event: PanGestureHandlerEventPayload) => {
    const newX = visibleWidth <= event.x ? visibleWidth : event.x < 0 ? 0 : event.x;

    const newPositionRelation = (newX - INDICATOR_SIZE / 2) / visibleWidth;

    onDrag(Math.floor(newPositionRelation * duration));
  };

  const pan = Gesture.Pan()
    .onUpdate(handlePan)
    .onStart(() => setIsDragging(true))
    .onEnd((event) => {
      setPosition(event);
      setIsDragging(false);
    });

  useEffect(() => {
    if (!isDragging) {
      setScrubberPosition((visibleWidth / 100) * percentagePosition);
    }
  }, [percentagePosition]);

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
                  left: scrubberPosition,
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
                  width: scrubberPosition,
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
    borderRadius: INDICATOR_SIZE,
    borderWidth: 1,
    height: INDICATOR_SIZE,
    position: "absolute",
    top: -6,
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
