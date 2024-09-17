import { Platform } from "react-native";
import Head from "expo-router/head";
import { ViewHistory } from "../../components";
import { useTranslation } from "react-i18next";

export default function history() {
  const { t } = useTranslation();
  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("viewHistory")}</title>
            <meta name="description" content={`${t("appName")} ${t("viewHistory").toLowerCase()}`} />
          </Head>
        ),
      })}
      <ViewHistory />
    </>
  );
}
