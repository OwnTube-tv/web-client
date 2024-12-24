import { useInfiniteVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { useMemo } from "react";
import { useInstanceConfig } from "../../../hooks";
import { ListSeparator } from "./ListSeparator";
import { useTranslation } from "react-i18next";

export const LatestVideosView = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage, isError, refetch } = useInfiniteVideosQuery({
    uniqueQueryKey: "homepageLatestVideosView",
    firstPageSize: currentInstanceConfig?.customizations?.homeLatestPublishedVideoCount,
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);
  const { t } = useTranslation();

  return (
    <>
      <VideoGrid
        isHeaderHidden
        isError={isError}
        refetch={refetch}
        isLoading={isLoading}
        data={videos}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
        link={{ text: t("showMore") }}
      />
      <ListSeparator />
    </>
  );
};
