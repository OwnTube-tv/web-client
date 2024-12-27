import { useMemo } from "react";
import { useInfiniteGetChannelVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../../app/_layout";
import { ROUTES } from "../../../types";
import { useTranslation } from "react-i18next";
import { useInstanceConfig } from "../../../hooks";

export const LatestVideos = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const { t } = useTranslation();
  const { channel } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();
  const { fetchNextPage, data, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteGetChannelVideosQuery({
    channelHandle: channel,
    uniqueQueryKey: "channelLatestVideosView",
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });

  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  return (
    <VideoGrid
      isLoading={isLoading}
      data={videos}
      title={t("latestVideos")}
      isLoadingMore={isFetchingNextPage}
      handleShowMore={hasNextPage ? fetchNextPage : undefined}
      link={{ text: t("showMore") }}
      isTVActionCardHidden={!hasNextPage}
    />
  );
};
