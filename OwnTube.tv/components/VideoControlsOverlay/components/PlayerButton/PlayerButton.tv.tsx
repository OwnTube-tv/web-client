import { forwardRef, useState } from "react";
import { borderRadius, spacing } from "../../../../theme";
import { IcoMoonIcon } from "../../../IcoMoonIcon";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { useTheme } from "@react-navigation/native";

const BORDER_WIDTH = 2;

const PlayerButton = forwardRef<View, TouchableOpacityProps & { icon: string; scale?: number; color?: string }>(
  ({ onPress, icon, scale = 1, color, ...restProps }, ref) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);

    const borderWidth = BORDER_WIDTH * scale;

    return (
      <TouchableOpacity
        activeOpacity={1}
        ref={ref}
        onPress={onPress}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.container,
          {
            width: styles.container.width * scale,
            height: styles.container.height * scale,
            padding: focused ? -borderWidth : 0,
            borderWidth: focused ? borderWidth : 0,
            borderColor: colors.white94,
            borderRadius: borderRadius.radiusMd * scale,
          },
        ]}
        {...restProps}
      >
        <IcoMoonIcon name={icon} size={spacing.xl * scale} color={color || colors.white80} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    padding: spacing.md,
    width: 48,
  },
});

PlayerButton.displayName = "PlayerButton";

export default PlayerButton;
