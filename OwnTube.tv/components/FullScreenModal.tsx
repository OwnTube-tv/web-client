import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { FC, PropsWithChildren } from "react";
import { colors } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FullScreenModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FullScreenModal: FC<PropsWithChildren<FullScreenModalProps>> = ({
  isVisible,
  onBackdropPress,
  children,
}) => {
  const { top } = useSafeAreaInsets();

  if (!isVisible) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.isTV ? 0 : top }]}>
      <AnimatedPressable
        accessible={false}
        onPress={onBackdropPress}
        entering={FadeIn}
        exiting={FadeOut}
        style={[
          styles.pressableOpacity,
          {
            backgroundColor: colors.dark.black50,
          },
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    cursor: "auto",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 999,
  },
  pressableOpacity: { bottom: 0, cursor: "auto", left: 0, position: "absolute", right: 0, top: 0 },
});
