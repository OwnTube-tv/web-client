import { ErrorMessage, InfoFooter, Loader, Typography, VideoGrid } from "../../components";
import { Screen } from "../../layouts";
import { useTheme } from "@react-navigation/native";
import { useGetVideosQuery } from "../../api";
import { GetVideosVideo } from "../../api/models";
import { organizeVideosByChannelAndCategory, VideosByChannel } from "../../utils";
import { useState } from "react";
import { useBreakpoints, useViewHistory } from "../../hooks";
import { spacing } from "../../theme";
import { ROUTES } from "../../types";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

export const HomeScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data, error, isLoading } = useGetVideosQuery<{
    raw: GetVideosVideo[];
    videosByChannel: VideosByChannel;
  }>({
    select: (data) => ({
      raw: data,
      videosByChannel: organizeVideosByChannelAndCategory(data),
    }),
  });
  const { viewHistory } = useViewHistory();
  const [latestVideosShown, setLatestVideosShown] = useState(12);
  const { isMobile } = useBreakpoints();

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (data?.raw.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Typography>{t("noVideosOrCategoriesFound")}</Typography>
      </View>
    );
  }

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        gap: spacing.xl,
        paddingRight: isMobile ? 0 : spacing.xl,
      }}
    >
      <VideoGrid
        title={t("latestVideos")}
        data={data?.raw?.slice(0, latestVideosShown)}
        handleShowMore={() => setLatestVideosShown((prevState) => prevState + 4)}
      />
      {viewHistory?.length !== 0 && (
        <VideoGrid
          headerLink={{ text: t("viewHistory"), href: { pathname: ROUTES.SETTINGS, params: { tab: "history" } } }}
          title={t("recentlyWatched")}
          icon="History"
          data={viewHistory?.slice(0, 4)}
          variant="history"
        />
      )}
      {data?.videosByChannel?.map(({ channel, data }) => (
        <VideoGrid
          headerLink={{ text: t("visitChannel"), href: { pathname: "#" } }}
          variant="channel"
          key={channel?.id}
          title={channel?.displayName}
          data={Object.values(data).flat().slice(0, 4)}
          channelLogoUri={channel?.avatar?.path}
        />
      ))}
      <VideoGrid
        headerLink={{ text: t("viewAll"), href: { pathname: "#" } }}
        title="Category"
        data={data?.raw?.slice(0, 4)}
      />
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 0,
  },
});
