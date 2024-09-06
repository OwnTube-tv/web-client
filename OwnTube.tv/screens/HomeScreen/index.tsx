import { InfoFooter, VideoGrid } from "../../components";
import { Screen } from "../../layouts";
import { useTheme } from "@react-navigation/native";
import { useGetCategoriesQuery, useGetChannelsQuery } from "../../api";
import { useMemo } from "react";
import { useBreakpoints, useViewHistory } from "../../hooks";
import { spacing } from "../../theme";
import { ROUTES } from "../../types";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { LatestVideosView, CategoryView } from "./components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ChannelView } from "../../components";

export const HomeScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();
  const { viewHistory } = useViewHistory();
  const { isMobile } = useBreakpoints();
  const { data: channels } = useGetChannelsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const historyData = useMemo(() => {
    return viewHistory?.filter(({ backend: itemBackend }) => itemBackend === backend).slice(0, 4);
  }, [viewHistory, backend]);

  return (
    <Screen
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        paddingRight: isMobile ? 0 : spacing.xl,
      }}
    >
      <LatestVideosView />
      {!!viewHistory?.length && (
        <VideoGrid
          headerLink={{ text: t("viewHistory"), href: { pathname: ROUTES.SETTINGS, params: { tab: "history" } } }}
          title={t("recentlyWatched")}
          icon="History"
          data={historyData}
          variant="history"
        />
      )}
      {channels?.map((channel) => <ChannelView key={channel.id} channel={channel} />)}
      {categories?.map((category) => <CategoryView category={category} key={category.id} />)}
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
    padding: 0,
  },
});
