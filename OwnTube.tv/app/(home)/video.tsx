import { VideoScreen } from "../../screens";
import Head from "expo-router/head";
import { useGetVideoQuery } from "../../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../_layout";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

export default function video() {
  const { id } = useLocalSearchParams<RootStackParams["video"]>();
  const { data: title } = useGetVideoQuery<string>({ id, select: (data) => data.name });
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <script src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1" />
            <title>{title}</title>
            <meta name="description" content={t("viewVideo")} />
          </Head>
        ),
      })}
      <VideoScreen />
    </>
  );
}
