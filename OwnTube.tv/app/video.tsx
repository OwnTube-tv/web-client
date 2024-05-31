import { VideoScreen } from "../screens";
import Head from "expo-router/head";
import { useGetVideosQuery } from "../api";
import { useLocalSearchParams } from "expo-router";

export default function video() {
  const { id } = useLocalSearchParams();
  const { data: videoTitle } = useGetVideosQuery({
    enabled: false,
    select: (data) => data.find(({ uuid }) => uuid === id)?.name || "Video",
  });

  return (
    <>
      <Head>
        <title>{videoTitle}</title>
        <meta name="description" content="View video" />
      </Head>
      <VideoScreen />
    </>
  );
}
