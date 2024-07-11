import { VideoScreen } from "../../screens";
import Head from "expo-router/head";
import { useGetVideoQuery } from "../../api";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../_layout";
import { useTranslation } from "react-i18next";

export default function video() {
  const { id } = useLocalSearchParams<RootStackParams["video"]>();
  const { data: title } = useGetVideoQuery(id, (data) => data.name);
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={t("viewVideo")} />
      </Head>
      <VideoScreen />
    </>
  );
}
