import Svg, { Rect } from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import { SvgProps } from "react-native-svg/src/elements/Svg";
import { StyleSheet, View } from "react-native";
import { useMemo } from "react";

const BORDER_WIDTH = 8;
const BORDER_OFFSET = 4;

export const FocusGuide = ({ width, height }: SvgProps) => {
  const { colors } = useTheme();
  const calculatedDimensions = useMemo(() => {
    return {
      width: Number(width) + BORDER_WIDTH * 2 + BORDER_OFFSET * 2,
      height: Number(height) + BORDER_WIDTH * 2 + BORDER_OFFSET * 2,
    };
  }, [width, height]);

  return (
    <View style={styles.container}>
      <Svg width={calculatedDimensions.width} height={calculatedDimensions.height}>
        <Rect
          x={String(BORDER_WIDTH / 2)}
          y={String(BORDER_WIDTH / 2)}
          width={Number(calculatedDimensions.width) - BORDER_WIDTH}
          height={Number(calculatedDimensions.height) - BORDER_WIDTH}
          rx={String(BORDER_WIDTH * 2)}
          ry={String(BORDER_WIDTH * 2)}
          fill="none"
          stroke={colors.theme950}
          strokeWidth={String(BORDER_WIDTH)}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    left: -(BORDER_WIDTH + BORDER_OFFSET),
    position: "absolute",
    top: -(BORDER_WIDTH + BORDER_OFFSET),
    zIndex: -1,
  },
});
