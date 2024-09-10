import { Link, useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { useGetCategoriesQuery, useGetChannelInfoQuery, useInfiniteGetChannelVideosQuery } from "../../api";
import { Button, Typography, VideoGrid } from "../../components";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { spacing } from "../../theme";
import { useMemo } from "react";
import { useBreakpoints } from "../../hooks";

export const ChannelCategoryScreen = () => {
  const { colors } = useTheme();
  const { isMobile } = useBreakpoints();
  const { backend, channel, category } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL_CATEGORY]>();
  const { data: channelInfo } = useGetChannelInfoQuery(backend, channel);
  const { data: categories } = useGetCategoriesQuery();
  const { fetchNextPage, data, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteGetChannelVideosQuery({
    channelHandle: channel,
    category: Number(category),
    uniqueQueryKey: "categoryView",
  });

  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  const categoryTitle = useMemo(() => {
    return categories?.find(({ id }) => id === Number(category))?.name || "";
  }, [category, categories]);

  return (
    <Screen style={{ padding: 0 }}>
      {channelInfo && (
        <View style={[styles.infoContainer, { paddingHorizontal: isMobile ? spacing.sm : spacing.xl }]}>
          <Link href={{ pathname: ROUTES.CHANNEL, params: { backend, channel } }} asChild>
            <Button contrast="low" icon="Arrow-Left" style={styles.backButton} />
          </Link>
          <Typography color={colors.themeDesaturated500} fontSize="sizeLg" fontWeight="SemiBold" numberOfLines={1}>
            {channelInfo?.displayName}
          </Typography>
        </View>
      )}
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
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  backButton: { height: 36, width: 36 },
  header: { marginBottom: -spacing.xl, paddingLeft: spacing.xl, textAlign: "left", width: "100%" },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
    paddingVertical: spacing.xl,
    width: "100%",
  },
});
