import { QUERY_KEYS, useInfiniteVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { useMemo } from "react";
import { ListSeparator } from "./ListSeparator";
import { useTranslation } from "react-i18next";
import { useAppConfigContext } from "../../../contexts";

export const LatestVideosView = () => {
  const { currentInstanceConfig } = useAppConfigContext();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage, isError, refetch } = useInfiniteVideosQuery({
    uniqueQueryKey: QUERY_KEYS.homepageLatestVideosView,
    firstPageSize: currentInstanceConfig?.customizations?.homeLatestPublishedVideoCount,
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);
  const { t } = useTranslation();
  const showHorizontalScrollableLists = currentInstanceConfig?.customizations?.homeUseHorizontalListsForMobilePortrait;

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
        isTVActionCardHidden={!hasNextPage}
        scrollable={showHorizontalScrollableLists}
      />
      <ListSeparator />
    </>
  );
};
