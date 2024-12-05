import { useTheme } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Spacer } from "../shared/Spacer";
import { borderRadius } from "../../theme";

export const VideoGridCardLoader = () => {
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.borderRadiusHelper, styles.thumbnail, animatedStyle]} />
      <Spacer height={8} />
      <Animated.View style={[styles.borderRadiusHelper, styles.line1, animatedStyle]} />
      <Spacer height={8} />
      <Animated.View style={[styles.borderRadiusHelper, styles.line2, animatedStyle]} />
      <Spacer height={8} />
      <Animated.View style={[styles.borderRadiusHelper, styles.line3, animatedStyle]} />
      <Spacer height={8} />
      <Animated.View style={[styles.borderRadiusHelper, styles.line4, animatedStyle]} />
    </View>
  );
};

export const styles = StyleSheet.create({
  borderRadiusHelper: {
    borderRadius: borderRadius.radiusSm,
  },
  container: { flex: 1, height: "100%", maxHeight: 314 },
  line1: {
    height: "8%",
    left: "2%",
    width: "95%",
  },
  line2: {
    height: "8%",
    left: "2%",
    width: "89%",
  },
  line3: {
    height: "4%",
    left: "2%",
    width: "39%",
  },
  line4: {
    height: "4%",
    left: "2%",
    width: "43%",
  },
  thumbnail: {
    height: "64%",
    width: "100%",
  },
});
