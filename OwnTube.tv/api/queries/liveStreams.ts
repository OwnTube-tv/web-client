import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { useQueries } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { ApiServiceImpl } from "../peertubeVideosApi";
import { retry } from "../helpers";
import { Video } from "@peertube/peertube-types";
import { OwnTubeError } from "../models";

export const useGetLiveStreamsCollectionQuery = (videoIds: string[] = []) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQueries({
    queries: videoIds.map((videoId) => ({
      queryKey: [QUERY_KEYS.liveStreamsCollection, videoId],
      queryFn: async () => {
        try {
          const res = await ApiServiceImpl.getVideo(backend!, videoId!);
          return { ...res, previewPath: `https://${backend}${res?.previewPath}` };
        } catch (e) {
          throw new OwnTubeError({ message: (e as unknown as { message: string }).message });
        }
      },
      retry,
      enabled: !!backend,
    })),
    combine: (result) => {
      return result.filter(({ data }) => !!data).map(({ data }) => data || ({} as Video));
    },
  });
};
