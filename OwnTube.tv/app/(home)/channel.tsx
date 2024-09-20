import { ChannelScreen } from "../../screens";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../_layout";
import { ROUTES } from "../../types";
import { useGetChannelInfoQuery } from "../../api";

export default function channel() {
  const { channel } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();

  const { data: channelInfo } = useGetChannelInfoQuery(channel);

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{channelInfo?.displayName}</title>
            <meta name="description" content="Channel view" />
          </Head>
        ),
      })}
      <ChannelScreen />
    </>
  );
}
