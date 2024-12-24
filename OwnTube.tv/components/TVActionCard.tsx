import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { Typography } from "./Typography";
import { borderRadius, spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { FocusGuide } from "./helpers";
import { useState } from "react";

export interface TVActionCardProps {
  width: number;
  text?: string;
  icon?: string;
  onPress?: () => void;
  isLoading?: boolean;
}

export const TVActionCard = ({ text, icon, onPress, width, isLoading }: TVActionCardProps) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.container, { width, backgroundColor: colors.theme100 }]}
      onPress={onPress}
    >
      {focused && <FocusGuide width={width} height={(width / 16) * 9} />}
      {isLoading ? (
        <ActivityIndicator size={24} />
      ) : icon ? (
        <IcoMoonIcon size={24} color={colors.theme500} name={icon} />
      ) : null}
      <Typography color={colors.theme900} fontWeight="SemiBold">
        {text}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    aspectRatio: 16 / 9,
    borderRadius: borderRadius.radiusMd,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
});
