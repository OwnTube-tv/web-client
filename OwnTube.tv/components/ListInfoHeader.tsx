import { View, Image, StyleSheet, Platform } from "react-native";
import { Typography } from "./Typography";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../theme";
import { useBreakpoints } from "../hooks";
import { useMemo } from "react";
import { Link } from "expo-router";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { useAppConfigContext } from "../contexts";

interface ListInfoHeaderProps {
  avatarUrl?: string;
  name?: string;
  description?: string;
  variant?: "playlist" | "channel";
  linkHref?: string;
}

export const ListInfoHeader = ({
  avatarUrl,
  name,
  description,
  variant = "channel",
  linkHref,
}: ListInfoHeaderProps) => {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const avatarDimensions = useMemo(() => {
    return {
      width: isMobile ? (variant === "playlist" ? 113 : 64) : variant === "playlist" ? 170 : 96,
      height: isMobile ? 64 : 96,
    };
  }, [isMobile, variant]);

  const { currentInstanceConfig } = useAppConfigContext();

  const isLinkShown =
    linkHref &&
    !process.env.EXPO_PUBLIC_HIDE_VIDEO_SITE_LINKS &&
    !currentInstanceConfig?.customizations?.hideChannelPlaylistLinks &&
    !Platform.isTV;

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
        <View style={[styles.headerContainer, { paddingRight: isMobile ? 0 : spacing.xxxl }]}>
          <Typography fontSize={isMobile ? "sizeXL" : "sizeXXL"} fontWeight="ExtraBold" color={colors.theme900}>
            {name}
          </Typography>
          {isLinkShown && (
            <Link target="_blank" rel="noreferrer noopener" href={linkHref}>
              <IcoMoonIcon color={colors.theme900} name="External-Link" size={16} />
            </Link>
          )}
        </View>
        <Typography
          style={styles.descriptionContainer}
          fontSize="sizeMd"
          fontWeight="Medium"
          color={colors.themeDesaturated500}
        >
          {description}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "flex-start", flexDirection: "row", paddingVertical: spacing.xl, width: "100%" },
  descriptionContainer: { flexShrink: 1, flexWrap: "wrap" },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  textContainer: { flex: 1, gap: spacing.md },
});
