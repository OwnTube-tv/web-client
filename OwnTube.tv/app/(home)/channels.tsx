import { ChannelsScreen } from "../../screens";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";

export default function channels() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("channels")}</title>
            <meta name="description" content="Channels list" />
          </Head>
        ),
      })}
      <ChannelsScreen />
    </>
  );
}
