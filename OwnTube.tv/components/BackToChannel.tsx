import { spacing } from "../theme";
import { Link, useLocalSearchParams } from "expo-router";
import { ROUTES } from "../types";
import { Button } from "./shared";
import { Typography } from "./Typography";
import { StyleSheet, View } from "react-native";
import { VideoChannel } from "@peertube/peertube-types";
import { useBreakpoints } from "../hooks";
import { RootStackParams } from "../app/_layout";
import { useTheme } from "@react-navigation/native";

interface BackToChannelProps {
  channelInfo: VideoChannel;
}

export const BackToChannel = ({ channelInfo }: BackToChannelProps) => {
  const { isMobile } = useBreakpoints();
  const { backend, channel } = useLocalSearchParams<
    RootStackParams[ROUTES.CHANNEL_CATEGORY] & RootStackParams[ROUTES.CHANNEL_PLAYLIST]
  >();
  const { colors } = useTheme();

  return (
    <View style={[styles.infoContainer, { paddingHorizontal: isMobile ? spacing.sm : spacing.xl }]}>
      <Link href={{ pathname: ROUTES.CHANNEL, params: { backend, channel } }} asChild>
        <Button contrast="low" icon="Arrow-Left" style={styles.backButton} />
      </Link>
      <Typography color={colors.themeDesaturated500} fontSize="sizeLg" fontWeight="SemiBold" numberOfLines={1}>
        {channelInfo?.displayName}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: { height: 36, paddingHorizontal: 6, paddingVertical: 6, width: 36 },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
    paddingVertical: spacing.xl,
    width: "100%",
  },
});
