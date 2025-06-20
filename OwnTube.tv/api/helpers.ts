import { GetVideosVideo, OwnTubeError } from "./models";
import { QUERY_KEYS } from "./constants";
import { UseQueryResult } from "@tanstack/react-query";

const jsonPaths: Record<keyof typeof QUERY_KEYS, string> = {
  videos: require("./../assets/testResponse-videos.json"),
  video: require("./../assets/testResponse-video.json"),
};

export const getLocalData = <TResult>(queryKey: keyof typeof QUERY_KEYS): TResult => {
  return jsonPaths[queryKey] as TResult;
};

export const retry = (failureCount: number, error: OwnTubeError) => {
  if (error.status === 429) {
    return true;
  }
  return failureCount < 5;
};

export const getErrorTextKeys = (error: OwnTubeError | null): { title: string; description: string } => {
  if (error && Number(error.status) >= 401 && Number(error.status) <= 403) {
    return { title: "accessDenied", description: "noPermissions" };
  } else {
    return { title: "pageCouldNotBeLoaded", description: "failedToEstablishConnection" };
  }
};

export const combineCollectionQueryResults = <T>(
  result: UseQueryResult<
    { data: Array<GetVideosVideo>; total: number; isError?: boolean; error?: unknown } & T,
    OwnTubeError
  >[],
) => {
  return {
    data: result.filter((item) => item?.data?.isError || Number(item?.data?.total) > 0),
    isLoading: result.filter(({ isLoading }) => isLoading).length > 1,
    isError: result.length > 0 && result.every(({ data }) => data?.isError),
  };
};
