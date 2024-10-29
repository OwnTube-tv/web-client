import { HomeScreen } from "../../screens";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { writeToAsyncStorage } from "../../utils";
import { ROUTES, STORAGE } from "../../types";
import { RootStackParams } from "../_layout";
import { useInstanceConfig, useRecentInstances } from "../../hooks";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { useTranslation } from "react-i18next";

export default function home() {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.HOME]>();
  const { recentInstances, addRecentInstance } = useRecentInstances();
  const { currentInstanceConfig } = useInstanceConfig();

  useEffect(() => {
    if (backend) {
      writeToAsyncStorage(STORAGE.DATASOURCE, backend);

      if (recentInstances?.[0] !== backend) {
        addRecentInstance(backend);
      }
    }
  }, [backend, recentInstances]);

  if (!backend) {
    return null;
  }

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>
              {currentInstanceConfig?.customizations?.pageTitle ?? `${t("appName")}${backend ? "@" + backend : ""}`}
            </title>
            <meta name="description" content="OwnTube.tv homepage" />
          </Head>
        ),
      })}
      <HomeScreen />
    </>
  );
}
