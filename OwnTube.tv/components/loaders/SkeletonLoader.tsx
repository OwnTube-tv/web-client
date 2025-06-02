import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@react-navigation/native";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { borderRadius } from "../../theme";

interface SkeletonLoaderProps {
  containerStyle: ViewStyle;
}

export const SkeletonLoader = ({ containerStyle }: SkeletonLoaderProps) => {
  const { colors } = useTheme();
  const animation = useRef(new Animated.Value(0.5)).current;

  const startAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animation]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const animatedStyle = {
    opacity: animation,
    backgroundColor: colors.theme200,
  };

  return <Animated.View style={[styles.borderRadiusHelper, containerStyle, animatedStyle]} />;
};

const styles = StyleSheet.create({
  borderRadiusHelper: {
    borderRadius: borderRadius.radiusSm,
  },
});
