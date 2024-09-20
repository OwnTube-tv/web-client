import { View, Image, StyleSheet } from "react-native";
import { Typography } from "./index";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../theme";
import { useBreakpoints } from "../hooks";
import { useMemo } from "react";

interface ListInfoHeaderProps {
  avatarUrl?: string;
  name?: string;
  description?: string;
  variant?: "playlist" | "channel";
}

export const ListInfoHeader = ({ avatarUrl, name, description, variant = "channel" }: ListInfoHeaderProps) => {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const avatarDimensions = useMemo(() => {
    return {
      width: isMobile ? (variant === "playlist" ? 113 : 64) : variant === "playlist" ? 170 : 96,
      height: isMobile ? 64 : 96,
    };
  }, [isMobile, variant]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isMobile ? spacing.sm : spacing.xl,
          gap: isMobile ? spacing.lg : spacing.xl,
        },
      ]}
    >
      {avatarUrl && (
        <Image source={{ uri: avatarUrl }} style={{ ...avatarDimensions, borderRadius: borderRadius.radiusMd }} />
      )}
      <View style={styles.textContainer}>
        <Typography fontSize={isMobile ? "sizeXL" : "sizeXXL"} fontWeight="ExtraBold" color={colors.theme900}>
          {name}
        </Typography>
        <Typography
          style={styles.descriptionContainer}
          fontSize="sizeMd"
          fontWeight="Medium"
          color={colors.themeDesaturated500}
          numberOfLines={4}
        >
          {description}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", paddingVertical: spacing.xl, width: "100%" },
  descriptionContainer: { flexShrink: 1, flexWrap: "wrap" },
  textContainer: { flex: 1, gap: spacing.md },
});
