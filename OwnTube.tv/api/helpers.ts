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
  if (error.code === 429) {
    return true;
  }
  return failureCount < 5;
};

export const combineCollectionQueryResults = <T>(
  result: UseQueryResult<{ data: Array<GetVideosVideo>; total: number } & T, OwnTubeError>[],
) => {
  return {
    data: result.map(({ data }) => data).filter((item) => Number(item?.total) > 0),
    isFetching: result.some(({ isFetching }) => isFetching),
  };
};
