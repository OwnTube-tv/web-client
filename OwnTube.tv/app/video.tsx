import { VideoScreen } from "../screens";
import Head from "expo-router/head";

export default function video() {
  return (
    <>
      <Head>
        <title>Video</title>
        <meta name="description" content="View video" />
      </Head>
      <VideoScreen />
    </>
  );
}
