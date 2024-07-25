import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useMemo, useState } from "react";
import { Typography } from "../../Typography";
import { getHumanReadableDuration } from "../../../utils";

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

  const handleTapOrPan = (x: number) => {
    if (visibleWidth < x || x < 0) {
      return;
    }

    setScrubberPosition(x - INDICATOR_SIZE / 2);
  };

  const setPosition = (x: number) => {
    const newX = visibleWidth <= x ? visibleWidth : x < 0 ? 0 : x;

    const newPositionRelation = (newX - INDICATOR_SIZE / 2) / visibleWidth;

    onDrag(Math.floor(newPositionRelation * duration));
  };

  const pan = Gesture.Pan()
    .onUpdate(({ x }) => {
      handleTapOrPan(x);
    })
    .onStart(() => setIsDragging(true))
    .onEnd(({ x }) => {
      setPosition(x);
      setIsDragging(false);
    })
    .minDistance(0);

  useEffect(() => {
    if (!isDragging) {
      setScrubberPosition((visibleWidth / 100) * percentagePosition);
    }
  }, [percentagePosition, visibleWidth]);

  const seekHint = useMemo(() => {
    return getHumanReadableDuration(duration * (scrubberPosition / visibleWidth));
  }, [scrubberPosition, visibleWidth, duration]);

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
            {isDragging && (
              <View
                style={[
                  styles.seekTime,
                  {
                    backgroundColor: colors.card,
                    left: scrubberPosition,
                  },
                ]}
              >
                <Typography>{seekHint}</Typography>
              </View>
            )}
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
    width: "95%",
  },
  scrubBarHitSlop: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  seekTime: {
    borderRadius: 8,
    padding: 8,
    position: "absolute",
    top: -50,
  },
});
