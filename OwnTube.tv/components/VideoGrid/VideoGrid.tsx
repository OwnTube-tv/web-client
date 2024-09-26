import { LinkProps } from "expo-router/build/link/Link";
import { Link, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useTheme } from "@react-navigation/native";
import { GetVideosVideo } from "../../api/models";
import { useBreakpoints, ViewHistoryEntry } from "../../hooks";
import { borderRadius, spacing } from "../../theme";
import { Typography } from "../Typography";
import { Image, StyleSheet, View } from "react-native";
import { Button } from "../shared";
import { IcoMoonIcon } from "../IcoMoonIcon";
import { Loader } from "../Loader";
import "./styles.css";
import { VideoGridContent } from "./VideoGridContent";
import { VideoListContent } from "./VideoListContent";
import { useState } from "react";
import { PresentationSwitch } from "./PresentationSwitch";

export interface VideoGridProps {
  data?: Array<GetVideosVideo | ViewHistoryEntry>;
  variant?: "default" | "channel" | "history";
  title?: string;
  icon?: string;
  headerLink?: {
    text: string;
    href: LinkProps<ROUTES>["href"];
  };
  handleShowMore?: () => void;
  channelLogoUri?: string;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  presentation?: "list" | "grid";
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
  isLoading,
  presentation,
}: VideoGridProps) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { colors } = useTheme();
  const { isMobile, isDesktop } = useBreakpoints();
  const [customPresentation, setCustomPresentation] = useState<VideoGridProps["presentation"]>(presentation || "grid");

  const handleSetPresentation = (newPresentation: VideoGridProps["presentation"]) => {
    setCustomPresentation(newPresentation);
  };

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
        {!!channelLogoUri && (
          <View style={{ alignSelf: "flex-start" }}>
            <Image style={styles.image} source={{ uri: `https://${backend}${channelLogoUri}` }} />
          </View>
        )}
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: spacing.lg, flex: 1 }}>
          <View style={styles.headerTextContainer}>
            {icon && <IcoMoonIcon size={24} name={icon} color={colors.theme900} />}
            {title && (
              <Typography fontSize="sizeXL" fontWeight="ExtraBold" color={colors.theme900} numberOfLines={1}>
                {title}
              </Typography>
            )}
          </View>
          <View style={styles.headerLinksContainer}>
            {!!headerLink && (
              <Link asChild href={headerLink.href}>
                <Button contrast="high" text={headerLink.text} />
              </Link>
            )}
          </View>
        </View>
      </View>
      {!!presentation && isDesktop && (
        <PresentationSwitch presentation={customPresentation} handleSetPresentation={handleSetPresentation} />
      )}
      {customPresentation === "grid" ? (
        <VideoGridContent isLoading={isLoading} data={data} backend={backend} />
      ) : (
        <VideoListContent isLoading={isLoading} data={data} backend={backend} />
      )}
      {!!handleShowMore && (
        <View style={styles.showMoreContainer}>
          <Button contrast="low" text="Show more" onPress={handleShowMore} />
          <View>{isLoadingMore && <Loader />}</View>
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
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerLinksContainer: { flexDirection: "row", gap: spacing.xl },
  headerTextContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: spacing.lg,
  },
  image: { borderRadius: borderRadius.radiusMd, height: 32, width: 32 },
  showMoreContainer: { alignSelf: "flex-start", flexDirection: "row", gap: spacing.xl, marginTop: spacing.xl },
});
