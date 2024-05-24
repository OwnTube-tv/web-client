import { HomeScreen } from "../screens";
import Head from "expo-router/head";

export default function index() {
  return (
    <>
      <Head>
        <title>OwnTube.tv Home</title>
        <meta name="description" content="OwnTube.tv homepage" />
      </Head>
      <HomeScreen />
    </>
  );
}
