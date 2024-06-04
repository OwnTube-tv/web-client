import { VideoView } from "../../components";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useGetVideoQuery } from "../../api";
import { useMemo } from "react";

export const VideoScreen = () => {
  const params = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();

  const { data } = useGetVideoQuery(params?.id);

  const uri = useMemo(() => {
    if (!params?.id || !data?.files?.length) {
      return null;
    }

    const files = data.files.filter(({ resolution }) => resolution.id <= 1080);

    // temporarily choose the highest quality
    return files[0].fileUrl;
  }, [params, data]);

  if (!uri) {
    return null;
  }

  return <VideoView testID={`${params.id}-video-view`} uri={uri} />;
};
