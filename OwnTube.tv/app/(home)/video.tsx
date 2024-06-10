import { VideoScreen } from "../../screens";
import Head from "expo-router/head";
import { useGetVideoQuery } from "../../api";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { RootStackParams } from "../_layout";

export default function video() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<RootStackParams["video"]>();
  const { data: title } = useGetVideoQuery(id, (data) => data.name);

  useEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [title]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="View video" />
      </Head>
      <VideoScreen />
    </>
  );
}
