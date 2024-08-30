import { useInfiniteVideosQuery } from "../../../api";
import { Loader, VideoGrid } from "../../../components";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export const LatestVideosView = () => {
  const { t } = useTranslation();

  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteVideosQuery();
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <VideoGrid
      data={videos}
      title={t("latestVideos")}
      isLoadingMore={isFetchingNextPage}
      handleShowMore={hasNextPage ? fetchNextPage : undefined}
    />
  );
};
