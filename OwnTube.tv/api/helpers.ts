import { GetVideosVideo, OwnTubeError } from "./models";
import { QUERY_KEYS } from "./constants";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { JsonType } from "posthog-react-native/lib/posthog-core/src";
import { Video } from "@peertube/peertube-types";

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
    isLoading: result.some(({ isLoading }) => isLoading),
    isError: result.length > 0 && result.every(({ data }) => data?.isError),
    error: (result.filter(({ data }) => data?.isError)?.map(({ data }) => data?.error) as OwnTubeError[]) || null,
  };
};

export const parseAxiosErrorDiagnosticsData = (error?: AxiosError): JsonType => {
  const requestUrl =
    error?.config?.baseURL && error?.config?.url ? new URL(error.config.url, error.config.baseURL).toString() : null;

  return {
    code: error?.code || null,
    requestUrl,
    method: error?.config?.method || null,
    params: error?.config?.params || null,
    timeout: error?.config?.timeout || null,
    status: error?.status || null,
  };
};

const _24HoursInSeconds = 24 * 60 * 60;

export const filterScheduledLivestreams = (videosList: Array<Video>, scheduledLiveThreshold?: number): Video[] => {
  const thresholdMs = (scheduledLiveThreshold || _24HoursInSeconds) * 1000;

  if (!isNaN(thresholdMs) && thresholdMs > 0) {
    const nowMs = new Date().getTime();

    return videosList.filter((video) => {
      const scheduledStart = video?.liveSchedules?.[0]?.startAt;
      if (!scheduledStart) return true;

      const scheduledMs = new Date(scheduledStart).getTime();

      const msLeft = scheduledMs - nowMs;

      return msLeft <= thresholdMs;
    });
  }

  return videosList;
};
