import { forwardRef, useState } from "react";
import { borderRadius, spacing } from "../../../../theme";
import { IcoMoonIcon } from "../../../IcoMoonIcon";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTheme } from "@react-navigation/native";

const PlayerButton = forwardRef<TouchableOpacity, TouchableOpacityProps & { icon: string }>(
  ({ onPress, icon, ...restProps }, ref) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);

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
            padding: focused ? -2 : 0,
            borderWidth: focused ? 2 : 0,
            borderColor: colors.white94,
          },
        ]}
        {...restProps}
      >
        <IcoMoonIcon name={icon} size={spacing.xl} color={colors.white80} />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: borderRadius.radiusMd,
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    padding: spacing.md,
    width: 48,
  },
});

PlayerButton.displayName = "PlayerButton";

export default PlayerButton;
