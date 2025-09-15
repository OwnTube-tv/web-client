import { Pressable } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { borderRadius } from "../theme";

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label: string;
}

export const RadioButton = ({ selected, onPress, label }: RadioButtonProps) => {
  const { colors } = useTheme();
  const isSelectedSV = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    isSelectedSV.value = selected ? 1 : 0;
  }, [selected]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    borderWidth: withTiming(isSelectedSV.value ? 6 : 1, { duration: 200 }),
    borderColor: withTiming(isSelectedSV.value ? colors.theme500 : colors.theme200, { duration: 200 }),
  }));

  return (
    <Pressable
      style={({ focused }) => ({
        flexDirection: "row",
        alignItems: "center",
        borderWidth: focused ? 2 : 0,
        padding: focused ? -2 : 0,
        margin: focused ? -2 : 0,
        borderColor: colors.theme950,
        borderRadius: borderRadius.radiusSm,
      })}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            width: 20,
            height: 20,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.theme100,
          },
          animatedButtonStyle,
        ]}
      />
      <Typography fontSize="sizeSm" fontWeight="Medium" style={{ marginLeft: 12 }}>
        {label}
      </Typography>
    </Pressable>
  );
};
