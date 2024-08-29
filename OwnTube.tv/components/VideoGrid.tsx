import { LinkProps } from "expo-router/build/link/Link";
import { Link, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useTheme } from "@react-navigation/native";
import { GetVideosVideo } from "../api/models";
import { useBreakpoints, ViewHistoryEntry } from "../hooks";
import { borderRadius, spacing } from "../theme";
import { Typography } from "./Typography";
import { Image, StyleSheet, View } from "react-native";
import { VideoGridCard } from "./VideoGridCard";
import { Button } from "./shared";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { Loader } from "./Loader";

interface VideoGridProps {
  data?: Array<GetVideosVideo | ViewHistoryEntry>;
  variant?: "default" | "channel" | "history";
  title: string;
  icon?: string;
  headerLink?: {
    text: string;
    href: LinkProps["href"];
  };
  handleShowMore?: () => void;
  channelLogoUri?: string;
  isLoadingMore?: boolean;
}

export const VideoGrid = ({
  data = [],
  variant = "default",
  title,
  icon,
  headerLink,
  handleShowMore,
  channelLogoUri,
  isLoadingMore,
}: VideoGridProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();

  return (
    <View
      style={[
        {
          paddingHorizontal: isMobile ? spacing.sm : spacing.xl,
          paddingVertical: isMobile ? spacing.lg : spacing.xl,
          ...styles.container,
        },
        ...(variant === "channel" ? [{ backgroundColor: colors.theme100 }, styles.channelContainer] : [{}]),
      ]}
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          {!!channelLogoUri && <Image style={styles.image} source={{ uri: `https://${backend}${channelLogoUri}` }} />}
          {icon && <IcoMoonIcon size={24} name={icon} color={colors.theme900} />}
          <Typography fontSize="sizeXL" fontWeight="ExtraBold" color={colors.theme900}>
            {title}
          </Typography>
        </View>
        {!!headerLink && (
          <Link asChild href={headerLink.href}>
            <Button contrast="high" text={headerLink.text} style={{ marginLeft: spacing.xxl }} />
          </Link>
        )}
      </View>
      <View style={styles.gridContainer}>
        {data.map((video) => {
          return (
            <View key={video.uuid} style={styles.gridItemContainer}>
              <VideoGridCard
                backend={variant === "history" && "backend" in video ? video.backend : backend}
                video={video}
              />
            </View>
          );
        })}
      </View>
      {!!handleShowMore && (
        <View style={styles.showMoreContainer}>
          <Button contrast="low" text="Show more" onPress={handleShowMore} />
          {isLoadingMore && <Loader />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  channelContainer: { borderRadius: borderRadius.radiusMd },
  container: {
    width: "100%",
  },
  gridContainer: {
    columnGap: spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    rowGap: spacing.xxl,
    width: "100%",
  },
  gridItemContainer: { flex: 1, maxHeight: 320, maxWidth: 360, minWidth: 277, width: "100%" },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
    justifyContent: "space-between",
    paddingBottom: spacing.xl,
  },
  headerTextContainer: { alignItems: "center", flexDirection: "row", gap: spacing.lg },
  image: { borderRadius: borderRadius.radiusMd, height: 32, width: 32 },
  showMoreContainer: { alignSelf: "flex-start", flexDirection: "row", gap: spacing.xl, marginTop: spacing.xl },
});
