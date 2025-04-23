import { forwardRef, useState } from "react";
import { borderRadius, spacing } from "../../../../theme";
import { IcoMoonIcon } from "../../../IcoMoonIcon";
import { Pressable, PressableProps, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface PlayerButtonProps extends PressableProps {
  icon: string;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  scale?: number;
  color?: string;
}

const PlayerButton = forwardRef<View, PlayerButtonProps>(({ onPress, icon, onHoverIn, onHoverOut, color }, ref) => {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverIn = () => {
    onHoverIn?.();
    setIsHovered(true);
  };

  const handleHoverOut = () => {
    onHoverOut?.();
    setIsHovered(false);
  };

  return (
    <Pressable
      ref={ref}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      onPress={onPress}
      style={({ focused }) => [
        styles.container,
        {
          padding: focused ? -2 : 0,
          borderWidth: focused ? 2 : 0,
          borderColor: colors.white94,
        },
      ]}
    >
      <IcoMoonIcon name={icon} size={spacing.xl} color={isHovered ? colors.white94 : color || colors.white80} />
    </Pressable>
  );
});

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
