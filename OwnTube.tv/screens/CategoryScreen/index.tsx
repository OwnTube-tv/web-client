import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { VideoGrid } from "../../components";
import { useInfiniteVideosQuery } from "../../api";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const CategoryScreen = () => {
  const { t } = useTranslation();
  const { category } = useLocalSearchParams<RootStackParams[ROUTES.CATEGORY]>();

  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteVideosQuery({
    uniqueQueryKey: "categoryVideosView",
    queryParams: { categoryOneOf: [Number(category)] },
  });
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  return (
    <Screen style={{ padding: 0 }}>
      <VideoGrid
        isLoading={isLoading}
        data={videos}
        title={t("latestVideos")}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
      />
    </Screen>
  );
};
