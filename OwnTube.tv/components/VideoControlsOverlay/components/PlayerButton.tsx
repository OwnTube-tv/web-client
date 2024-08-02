import { useState } from "react";
import { spacing } from "../../../theme";
import { IcoMoonIcon } from "../../IcoMoonIcon";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

interface PlayerButtonProps {
  onPress: () => void;
  icon: string;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

export const PlayerButton = ({ onPress, icon, onHoverIn, onHoverOut }: PlayerButtonProps) => {
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
    <Pressable onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} onPress={onPress} style={styles.container}>
      <IcoMoonIcon name={icon} size={spacing.xl} color={isHovered ? colors.white94 : colors.white80} />
    </Pressable>
  );
};

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
