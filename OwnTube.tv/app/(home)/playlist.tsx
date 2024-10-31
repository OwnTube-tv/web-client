import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { Playlist } from "../../screens";
import Constants from "expo-constants";

export default function playlists() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("playlist")}</title>
            <meta name="description" content={`${Constants.expoConfig?.name} ${t("playlist").toLowerCase()}`} />
          </Head>
        ),
      })}
      <Playlist />
    </>
  );
}
