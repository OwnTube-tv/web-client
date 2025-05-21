import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { QUERY_KEYS, useGetCategoriesQuery, useGetChannelInfoQuery, useInfiniteGetChannelVideosQuery } from "../../api";
import { BackToChannel, InfoFooter, Typography, VideoGrid } from "../../components";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { spacing } from "../../theme";
import { useMemo } from "react";
import { useBreakpoints, useCustomFocusManager, usePageContentTopPadding } from "../../hooks";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "../../contexts";
import { useQueryClient } from "@tanstack/react-query";

export const ChannelCategoryScreen = () => {
  const queryClient = useQueryClient();
  const { currentInstanceConfig } = useAppConfigContext();
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const { channel, category } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL_CATEGORY]>();
  const { data: channelInfo } = useGetChannelInfoQuery(channel);
  const { data: categories } = useGetCategoriesQuery({});
  const { fetchNextPage, data, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteGetChannelVideosQuery({
    channelHandle: channel,
    category: Number(category),
    uniqueQueryKey: "categoryView",
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });
  const { t } = useTranslation();
  const { top } = usePageContentTopPadding();
  useCustomFocusManager();

  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  const categoryTitle = useMemo(() => {
    return categories?.find(({ id }) => id === Number(category))?.name || "";
  }, [category, categories]);

  const refetchPageData = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.videos], type: "active" });
  };

  return (
    <Screen onRefresh={refetchPageData} style={{ padding: 0, paddingTop: top }}>
      {channelInfo && <BackToChannel channelInfo={channelInfo} />}
      <Typography
        style={styles.header}
        fontSize={isMobile ? "sizeXL" : "sizeXXL"}
        fontWeight="ExtraBold"
        color={colors.theme900}
        numberOfLines={1}
      >
        {categoryTitle}
      </Typography>
      <VideoGrid
        data={videos}
        isLoading={isLoading}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
        link={{ text: t("showMore") }}
        isTVActionCardHidden={!hasNextPage}
      />
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: -spacing.xl, paddingLeft: spacing.xl, textAlign: "left", width: "100%" },
});
