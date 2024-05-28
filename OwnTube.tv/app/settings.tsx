import { SettingsScreen } from "../screens";
import Head from "expo-router/head";

export default function settings() {
  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="OwnTube.tv settings" />
      </Head>
      <SettingsScreen />
    </>
  );
}
