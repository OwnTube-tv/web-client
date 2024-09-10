import { OwnTubeError } from "./models";
import { QUERY_KEYS } from "./constants";

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
